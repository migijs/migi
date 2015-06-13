build:
	@gulp

build-test:
	@gulp build-test

init:
	@export SAUCE_USERNAME=army8735
  @export SAUCE_ACCESS_KEY=6edc1ec9-7e0d-43c8-8d75-e9d8456d11f9

test-nightwatch:
	./node_modules/.bin/nightwatch --test tests/test.js --env chrome

test: build-test test-nightwatch

coveralls: build-test
	@mocha tests/test.js --require blanket --reporter mocha-lcov-reporter | ./node_modules/coveralls/bin/coveralls.js

test-cov: build-test
	@mocha tests/test.js --require blanket -R html-cov > tests/covrage.html

.PHONY: build