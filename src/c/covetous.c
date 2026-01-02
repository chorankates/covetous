#include <pebble.h>

// Window and layers
static Window *s_window;
static Layer *s_canvas_layer;
static TextLayer *s_day_layer;
static TextLayer *s_hour_layer;

// Buffers for text
static char s_day_buffer[4];
static char s_hour_buffer[4];

// Grid configuration
#define GRID_COLS 10
#define GRID_ROWS 6
#define GRID_CELL_SIZE 8
#define GRID_CELL_SPACING 2
#define GRID_OFFSET_X 36
#define GRID_OFFSET_Y 58

// Battery bar configuration
#define BATTERY_BAR_COUNT 5
#define BATTERY_BAR_WIDTH 3
#define BATTERY_BAR_HEIGHT 12
#define BATTERY_BAR_SPACING 2
#define BATTERY_OFFSET_X 112
#define BATTERY_OFFSET_Y 8

// Draw the minute grid
static void draw_minute_grid(GContext *ctx, int minutes) {
  for (int row = 0; row < GRID_ROWS; row++) {
    for (int col = 0; col < GRID_COLS; col++) {
      int cell_minute = row * GRID_COLS + col;
      int x = GRID_OFFSET_X + col * (GRID_CELL_SIZE + GRID_CELL_SPACING);
      int y = GRID_OFFSET_Y + row * (GRID_CELL_SIZE + GRID_CELL_SPACING);
      
      GRect cell_rect = GRect(x, y, GRID_CELL_SIZE, GRID_CELL_SIZE);
      
      if (cell_minute < minutes) {
        // Filled cell for elapsed minutes
        graphics_context_set_fill_color(ctx, GColorWhite);
        graphics_fill_rect(ctx, cell_rect, 0, GCornerNone);
      } else {
        // Dim/outline cell for remaining minutes
        graphics_context_set_stroke_color(ctx, GColorLightGray);
        graphics_context_set_stroke_width(ctx, 1);
        // Draw small dots/squares for unfilled cells
        GRect dot_rect = GRect(x + 2, y + 2, 4, 4);
        graphics_context_set_fill_color(ctx, GColorDarkGray);
        graphics_fill_rect(ctx, dot_rect, 0, GCornerNone);
      }
    }
  }
}

// Draw battery indicator bars
static void draw_battery_bars(GContext *ctx, int battery_percent) {
  int bars_filled = (battery_percent + 19) / 20; // Round up: 1-20%=1 bar, 21-40%=2 bars, etc.
  if (battery_percent == 0) bars_filled = 0;
  
  for (int i = 0; i < BATTERY_BAR_COUNT; i++) {
    int x = BATTERY_OFFSET_X + i * (BATTERY_BAR_WIDTH + BATTERY_BAR_SPACING);
    int y = BATTERY_OFFSET_Y;
    
    GRect bar_rect = GRect(x, y, BATTERY_BAR_WIDTH, BATTERY_BAR_HEIGHT);
    
    if (i < bars_filled) {
      // Filled bar
      graphics_context_set_fill_color(ctx, GColorWhite);
      graphics_fill_rect(ctx, bar_rect, 0, GCornerNone);
    } else {
      // Empty bar outline
      graphics_context_set_stroke_color(ctx, GColorDarkGray);
      graphics_draw_rect(ctx, bar_rect);
    }
  }
}

// Canvas update procedure
static void canvas_update_proc(Layer *layer, GContext *ctx) {
  // Get current time
  time_t now = time(NULL);
  struct tm *t = localtime(&now);
  
  // Get battery state
  BatteryChargeState battery = battery_state_service_peek();
  
  // Draw minute grid
  draw_minute_grid(ctx, t->tm_min);
  
  // Draw battery bars
  draw_battery_bars(ctx, battery.charge_percent);
}

// Update time display
static void update_time() {
  time_t now = time(NULL);
  struct tm *t = localtime(&now);
  
  // Update day of month
  snprintf(s_day_buffer, sizeof(s_day_buffer), "%d", t->tm_mday);
  text_layer_set_text(s_day_layer, s_day_buffer);
  
  // Update hour (24h format)
  snprintf(s_hour_buffer, sizeof(s_hour_buffer), "%d", t->tm_hour);
  text_layer_set_text(s_hour_layer, s_hour_buffer);
  
  // Mark canvas layer dirty to redraw grid
  layer_mark_dirty(s_canvas_layer);
}

// Tick handler
static void tick_handler(struct tm *tick_time, TimeUnits units_changed) {
  update_time();
}

// Battery state change handler
static void battery_handler(BatteryChargeState charge) {
  layer_mark_dirty(s_canvas_layer);
}

// Window load
static void prv_window_load(Window *window) {
  Layer *window_layer = window_get_root_layer(window);
  GRect bounds = layer_get_bounds(window_layer);
  
  // Set black background
  window_set_background_color(window, GColorBlack);
  
  // Create canvas layer for custom drawing (grid and battery)
  s_canvas_layer = layer_create(bounds);
  layer_set_update_proc(s_canvas_layer, canvas_update_proc);
  layer_add_child(window_layer, s_canvas_layer);
  
  // Create day of month text layer (upper left)
  s_day_layer = text_layer_create(GRect(4, 2, 40, 30));
  text_layer_set_background_color(s_day_layer, GColorClear);
  text_layer_set_text_color(s_day_layer, GColorWhite);
  text_layer_set_font(s_day_layer, fonts_get_system_font(FONT_KEY_GOTHIC_18_BOLD));
  text_layer_set_text_alignment(s_day_layer, GTextAlignmentLeft);
  layer_add_child(window_layer, text_layer_get_layer(s_day_layer));
  
  // Create hour text layer (large, left side)
  s_hour_layer = text_layer_create(GRect(0, 18, 38, 50));
  text_layer_set_background_color(s_hour_layer, GColorClear);
  text_layer_set_text_color(s_hour_layer, GColorWhite);
  text_layer_set_font(s_hour_layer, fonts_get_system_font(FONT_KEY_LECO_42_NUMBERS));
  text_layer_set_text_alignment(s_hour_layer, GTextAlignmentRight);
  layer_add_child(window_layer, text_layer_get_layer(s_hour_layer));
  
  // Initial time update
  update_time();
}

// Window unload
static void prv_window_unload(Window *window) {
  text_layer_destroy(s_day_layer);
  text_layer_destroy(s_hour_layer);
  layer_destroy(s_canvas_layer);
}

// Initialize
static void prv_init(void) {
  s_window = window_create();
  window_set_window_handlers(s_window, (WindowHandlers) {
    .load = prv_window_load,
    .unload = prv_window_unload,
  });
  
  // Subscribe to time tick events (every minute)
  tick_timer_service_subscribe(MINUTE_UNIT, tick_handler);
  
  // Subscribe to battery state events
  battery_state_service_subscribe(battery_handler);
  
  window_stack_push(s_window, true);
}

// Deinitialize
static void prv_deinit(void) {
  tick_timer_service_unsubscribe();
  battery_state_service_unsubscribe();
  window_destroy(s_window);
}

int main(void) {
  prv_init();
  app_event_loop();
  prv_deinit();
}
