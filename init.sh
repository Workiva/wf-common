#!/bin/sh

# colors
ESC_SEQ="\x1b["
COL_RED=$ESC_SEQ"31;01m"
COL_CYAN=$ESC_SEQ"36;01m"

# prepare the dev environment
git clean -fxd
npm install
bower install

if [ $? -ne 0 ]; then
  echo "$COL_RED"
  echo "\nINIT FAILED!\n"
  exit 1
fi

echo "$COL_CYAN"
echo "\nGO FORTH AND CONQUER\n"

echo "At any time you may:"
echo "--------------------"
echo "grunt -h    # show available tasks."
echo "grunt dev   # lint and test, open the project web site and watch."
echo "grunt qa    # initialize your environment, check code quality and open the project web site."
echo ""

exit 0
