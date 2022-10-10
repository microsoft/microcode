#!/bin/sh

set -x
set -e

apt-get install -y make build-essential ruby ruby-dev
gem install bundler jekyll
