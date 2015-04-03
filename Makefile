TESTS = $(shell ls -S `find test/ -type f -name "*.test.js" -print`)
BIN_MOCHA = ./node_modules/.bin/mocha
_BIN_MOCHA = ./node_modules/.bin/_mocha
ISTANBUL = ./node_modules/.bin/istanbul

all: test

install:
	npm install

test: install
	NODE_ENV=test $(BIN_MOCHA) -b -r should $(TESTS)

test-cov cov: install
	NODE_ENV=test $(ISTANBUL) cover $(_BIN_MOCHA) --\
	  -r should \
	  $(TESTS)

.PHONY: all test
