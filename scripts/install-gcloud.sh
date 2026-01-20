#!/usr/bin/env bash
set -euo pipefail
echo "Installing Google Cloud SDK (gcloud)..."

if command -v brew >/dev/null 2>&1; then
  echo "Using Homebrew to install google-cloud-sdk"
  brew install --cask google-cloud-sdk || brew install google-cloud-sdk
  exit 0
fi

if command -v apt-get >/dev/null 2>&1; then
  echo "Detected apt-get. Installing prerequisites and Google Cloud SDK (may require sudo)."
  sudo apt-get update
  sudo apt-get install -y apt-transport-https ca-certificates gnupg
  echo "Adding Cloud SDK distribution URI as a package source"
  echo "deb [signed-by=/usr/share/keyrings/cloud.google.gpg] http://packages.cloud.google.com/apt cloud-sdk main" | sudo tee -a /etc/apt/sources.list.d/google-cloud-sdk.list
  curl https://packages.cloud.google.com/apt/doc/apt-key.gpg | sudo gpg --dearmor -o /usr/share/keyrings/cloud.google.gpg
  sudo apt-get update && sudo apt-get install -y google-cloud-sdk
  exit 0
fi

if command -v yum >/dev/null 2>&1 || command -v dnf >/dev/null 2>&1; then
  echo "Detected yum/dnf. Please follow the official instructions: https://cloud.google.com/sdk/docs/install"
  exit 0
fi

echo "No supported package manager found. Please follow official install docs: https://cloud.google.com/sdk/docs/install"
exit 1
