// Covetous - Pebble Watchface
// Inspired by the grid-based time display

var rocky = require('rocky');

// 5x7 dot-matrix font for small numbers (day of month)
var SMALL_FONT = {
  '0': [0x0E, 0x11, 0x13, 0x15, 0x19, 0x11, 0x0E],
  '1': [0x04, 0x0C, 0x04, 0x04, 0x04, 0x04, 0x0E],
  '2': [0x0E, 0x11, 0x01, 0x02, 0x04, 0x08, 0x1F],
  '3': [0x1F, 0x02, 0x04, 0x02, 0x01, 0x11, 0x0E],
  '4': [0x02, 0x06, 0x0A, 0x12, 0x1F, 0x02, 0x02],
  '5': [0x1F, 0x10, 0x1E, 0x01, 0x01, 0x11, 0x0E],
  '6': [0x06, 0x08, 0x10, 0x1E, 0x11, 0x11, 0x0E],
  '7': [0x1F, 0x01, 0x02, 0x04, 0x08, 0x08, 0x08],
  '8': [0x0E, 0x11, 0x11, 0x0E, 0x11, 0x11, 0x0E],
  '9': [0x0E, 0x11, 0x11, 0x0F, 0x01, 0x02, 0x0C]
};

// Large 10x14 pixel font for the hour display
var LARGE_FONT = {
  '0': [
    0x1F8, 0x3FC, 0x606, 0x403, 0x403, 0x403, 0x403,
    0x403, 0x403, 0x403, 0x403, 0x606, 0x3FC, 0x1F8
  ],
  '1': [
    0x030, 0x070, 0x0F0, 0x030, 0x030, 0x030, 0x030,
    0x030, 0x030, 0x030, 0x030, 0x030, 0x1FE, 0x1FE
  ],
  '2': [
    0x1F8, 0x3FC, 0x606, 0x006, 0x006, 0x00C, 0x018,
    0x030, 0x060, 0x0C0, 0x180, 0x300, 0x3FE, 0x3FE
  ],
  '3': [
    0x1F8, 0x3FC, 0x606, 0x006, 0x006, 0x03C, 0x03C,
    0x006, 0x006, 0x006, 0x006, 0x606, 0x3FC, 0x1F8
  ],
  '4': [
    0x018, 0x038, 0x058, 0x098, 0x118, 0x218, 0x218,
    0x3FE, 0x3FE, 0x018, 0x018, 0x018, 0x018, 0x018
  ],
  '5': [
    0x3FE, 0x3FE, 0x300, 0x300, 0x3F8, 0x3FC, 0x006,
    0x006, 0x006, 0x006, 0x006, 0x606, 0x3FC, 0x1F8
  ],
  '6': [
    0x078, 0x0F8, 0x180, 0x300, 0x300, 0x3F8, 0x3FC,
    0x306, 0x306, 0x306, 0x306, 0x18C, 0x0F8, 0x070
  ],
  '7': [
    0x3FE, 0x3FE, 0x006, 0x00C, 0x00C, 0x018, 0x018,
    0x030, 0x030, 0x060, 0x060, 0x060, 0x060, 0x060
  ],
  '8': [
    0x1F8, 0x3FC, 0x606, 0x606, 0x606, 0x3FC, 0x3FC,
    0x606, 0x606, 0x606, 0x606, 0x606, 0x3FC, 0x1F8
  ],
  '9': [
    0x0F8, 0x1FC, 0x306, 0x606, 0x606, 0x606, 0x3FE,
    0x1FE, 0x006, 0x006, 0x00C, 0x018, 0x1F0, 0x1E0
  ]
};

// Draw a small number using dot-matrix font
function drawSmallNumber(ctx, num, x, y, pixelSize) {
  var str = num.toString();
  if (num < 10) str = '0' + str;
  
  var offsetX = 0;
  for (var c = 0; c < str.length; c++) {
    var char = str[c];
    var bitmap = SMALL_FONT[char];
    if (bitmap) {
      for (var row = 0; row < 7; row++) {
        var rowData = bitmap[row];
        for (var col = 0; col < 5; col++) {
          if (rowData & (0x10 >> col)) {
            ctx.fillRect(
              x + offsetX + col * pixelSize,
              y + row * pixelSize,
              pixelSize - 1,
              pixelSize - 1
            );
          }
        }
      }
    }
    offsetX += 6 * pixelSize;
  }
}

// Draw a large number using pixel font
function drawLargeNumber(ctx, num, x, y, pixelSize) {
  var str = num.toString();
  if (num < 10) str = '0' + str;
  
  var offsetX = 0;
  for (var c = 0; c < str.length; c++) {
    var char = str[c];
    var bitmap = LARGE_FONT[char];
    if (bitmap) {
      for (var row = 0; row < 14; row++) {
        var rowData = bitmap[row];
        for (var col = 0; col < 10; col++) {
          if (rowData & (0x200 >> col)) {
            ctx.fillRect(
              x + offsetX + col * pixelSize,
              y + row * pixelSize,
              pixelSize - 1,
              pixelSize - 1
            );
          }
        }
      }
    }
    offsetX += 11 * pixelSize;
  }
}

// Draw the 6x10 minute grid
function drawMinuteGrid(ctx, minutes, x, y, cellSize, gap) {
  var totalCells = 60;
  var cols = 6;
  var rows = 10;
  
  for (var i = 0; i < totalCells; i++) {
    var row = Math.floor(i / cols);
    var col = i % cols;
    
    var cellX = x + col * (cellSize + gap);
    var cellY = y + row * (cellSize + gap);
    
    if (i < minutes) {
      // Filled cell for elapsed minutes
      ctx.fillRect(cellX, cellY, cellSize, cellSize);
    } else {
      // Small dot for remaining minutes
      var dotSize = Math.max(2, Math.floor(cellSize / 3));
      var dotOffset = Math.floor((cellSize - dotSize) / 2);
      ctx.fillRect(cellX + dotOffset, cellY + dotOffset, dotSize, dotSize);
    }
  }
}

// Draw battery indicator bars
function drawBattery(ctx, percent, x, y, barWidth, barHeight, gap) {
  var bars = 5;
  var filledBars = Math.ceil(percent / 20);
  
  for (var i = 0; i < bars; i++) {
    var barX = x + i * (barWidth + gap);
    
    if (i < filledBars) {
      // Filled bar
      ctx.fillRect(barX, y, barWidth, barHeight);
    } else {
      // Empty bar outline
      ctx.strokeRect(barX + 0.5, y + 0.5, barWidth - 1, barHeight - 1);
    }
  }
}

// Main draw function
function drawWatchface(ctx, width, height) {
  // Get current time
  var now = new Date();
  var hours = now.getHours();
  var minutes = now.getMinutes();
  var day = now.getDate();
  
  // Get battery level (mock for emulator, real on watch)
  var batteryPercent = 100;
  if (typeof rocky.watchInfo !== 'undefined' && rocky.watchInfo.battery) {
    batteryPercent = rocky.watchInfo.battery.chargePercent;
  }
  
  // Clear background
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, width, height);
  
  // Set drawing color to white
  ctx.fillStyle = 'white';
  ctx.strokeStyle = 'white';
  ctx.lineWidth = 1;
  
  // Calculate layout based on screen size
  var isRound = (width === height && width >= 180); // Chalk
  var margin = isRound ? 25 : 8;
  
  // Scale factors for different screen sizes
  var scale = width / 144;
  
  // Draw day of month (upper left)
  var smallPixel = Math.max(2, Math.round(2 * scale));
  drawSmallNumber(ctx, day, margin, margin, smallPixel);
  
  // Draw battery bars (upper right)
  var batteryBarWidth = Math.round(3 * scale);
  var batteryBarHeight = Math.round(14 * scale);
  var batteryGap = Math.round(2 * scale);
  var batteryTotalWidth = 5 * batteryBarWidth + 4 * batteryGap;
  var batteryX = width - margin - batteryTotalWidth;
  drawBattery(ctx, batteryPercent, batteryX, margin, batteryBarWidth, batteryBarHeight, batteryGap);
  
  // Draw large hour (middle-left area)
  var largePixel = Math.max(3, Math.round(3 * scale));
  var hourY = margin + Math.round(25 * scale);
  drawLargeNumber(ctx, hours, margin, hourY, largePixel);
  
  // Draw minute grid (below hour)
  var gridCellSize = Math.round(12 * scale);
  var gridGap = Math.round(3 * scale);
  var gridY = hourY + 14 * largePixel + Math.round(10 * scale);
  var gridX = margin;
  
  // Adjust cell size to fit screen width
  var availableWidth = width - 2 * margin;
  var gridTotalWidth = 6 * gridCellSize + 5 * gridGap;
  if (gridTotalWidth > availableWidth) {
    gridCellSize = Math.floor((availableWidth - 5 * gridGap) / 6);
  }
  
  drawMinuteGrid(ctx, minutes, gridX, gridY, gridCellSize, gridGap);
}

// Register for draw events
rocky.on('draw', function(event) {
  var ctx = event.context;
  var w = ctx.canvas.unobstructedWidth;
  var h = ctx.canvas.unobstructedHeight;
  
  drawWatchface(ctx, w, h);
});

// Update every minute
rocky.on('minutechange', function(event) {
  rocky.requestDraw();
});

// Also handle hourchange for battery updates
rocky.on('hourchange', function(event) {
  rocky.requestDraw();
});

