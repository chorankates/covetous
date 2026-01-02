.PHONY: deploy

all: clean build

clean:
	rm -rf build/

build: clean
	pebble build

deploy: build
	pebble install --cloudpebble
