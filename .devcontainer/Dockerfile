FROM mcr.microsoft.com/devcontainers/base:ubuntu

# Install core utilities and add 1Password repository
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
    curl \
    gnupg \
    && curl -sS https://downloads.1password.com/linux/keys/1password.asc | \
    gpg --dearmor --yes --output /usr/share/keyrings/1password-archive-keyring.gpg \
    && echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/1password-archive-keyring.gpg] https://downloads.1password.com/linux/debian/$(dpkg --print-architecture) stable main" \
    > /etc/apt/sources.list.d/1password.list

# Install packages
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
    1password-cli \
    git-secret \
    moreutils \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Install Node.js LTS (using NodeSource)
RUN curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash - \
    && sudo apt-get install -y nodejs