.PHONY: all clean build dev-deploy screenshots

SCREENSHOT_DIR = media/screenshots

# All Pebble platforms
PLATFORMS = aplite basalt chalk diorite emery flint

all: clean build

clean:
	rm -rf build/

build:
	pebble build

dev-deploy: build
	pebble install --cloudpebble

# Take screenshot on a single platform: make screenshot-basalt
screenshot-%: build
	@mkdir -p $(SCREENSHOT_DIR)
	pebble install --emulator $*
	sleep 2
	pebble screenshot --emulator $* $(SCREENSHOT_DIR)/$*.png; \
	make emulator-kill; \

# Take screenshots on all platforms
screenshots: build
	@for platform in $(PLATFORMS); do \
		echo "==> Taking screenshot for $$platform"; \
		make screenshot-$$platform; \
		make emulator-kill; \
	done

emulator-kill:
	@pkill -f "qemu-pebble" 2>/dev/null || true