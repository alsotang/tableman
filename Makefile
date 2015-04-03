TESTS = $(shell ls -S `find test/ -type f -name "*.test.js" -print`)
BIN_MOCHA = ./node_modules/.bin/mocha


all: test

install:
	npm install

test: install
	NODE_ENV=test $(BIN_MOCHA) -b -r should $(TESTS)

.PHONY: all test
