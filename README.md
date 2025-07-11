# crosskeys

## Installation

This package is not yet published to npm. To install globally, use GitHub directly with npm:

```sh
npm install -g git+https://github.com/tomorrowarchitect/crosskeys.git
```

To upgrade, simply reinstall using the same command above.

## Usage

### 1. Basic Use Case: Managing Username/Password Pairs

`crosskeys` lets you securely store and retrieve username/password pairs for any service. You can set, get, and unset credentials from the command line:

```sh
# Set a credential
crosskeys set <profile> <username> <password>

# Get the username
crosskeys username <profile>

# Get the password
crosskeys password <profile>

# Remove a credential
crosskeys unset <profile>
```

Credentials are stored securely and can be retrieved by profile name.

---

### 2. Git Credential Manager for HTTP-based Git Operations

You can use `crosskeys` as a credential helper for Git over HTTP/HTTPS. This allows Git to fetch credentials from your secure store automatically.

**Setup:**

To preview the recommended Git config for your profile and host:

```sh
crosskeys git config-https <profile> <host>
```

To auto-apply the configuration:

```sh
crosskeys git config-https <profile> <host> --apply
```

For example, to configure for GitHub with a profile named `github-work`:

```sh
crosskeys git config-https github-work https://github.com/org-name/
```

Example output:

```
To configure git to use this credential helper, open your global git config file (usually located at ~/.gitconfig) and add the following section:

[credential "git@github.com:org-name/"]
    helper = crosskeys github-work

Alternatively, you can run this command with the --apply flag to set it automatically.
```

or to auto-apply:

```sh
crosskeys git config-https github-work https://github.com/org-name/ --apply
```

This will set up Git to use `crosskeys` as the credential helper for the specified host and profile. Now, when you perform Git operations over HTTP/HTTPS, Git will use the credentials managed by `crosskeys` for authentication.

---

### 3. SSH Identities Manager for SSH-based Git Operations

`crosskeys` can also manage SSH identities and automate SSH configuration for Git over SSH. This is useful for using different SSH keys per profile or host.

**Setup:**

You can generate and manage SSH keys with:

```sh
crosskeys ssh keygen <profile>
```

To preview the recommended Git and SSH config for your profile and base SSH path:

```sh
crosskeys git config-ssh <profile> <base_ssh_path>
```

To auto-apply the configuration:

```sh
crosskeys git config-ssh <profile> <base_ssh_path> --apply
```

For example, to configure for GitHub with a profile named `github-work`:

```sh
crosskeys git config-ssh github-work git@github.com:org-name/
```

Example output:

```
To configure git and ssh for this profile, add the following to your configuration files:

In your ~/.gitconfig:

[url "git@github-work.crosskeys:org-name/"]
    insteadOf = git@github.com:org-name/

In your ~/.ssh/config:

Host github-work.crosskeys
    HostName github.com
    User git
    IdentityFile ~/.crosskeys/identities/github-work
    IdentitiesOnly yes
    ProxyCommand ssh-exec-crosskeys %h %p github-work

Alternatively, you can run this command with the --apply flag to set the credential helper automatically.
```

or to auto-apply:

```sh
crosskeys git config-ssh github-work git@github.com:org-name/ --apply
```

This will:

- Set up a Git `insteadOf` rule to rewrite URLs for the profile
- Add an SSH config entry for the profile, using the managed identity and a custom ProxyCommand

You can then use URLs like:

```
git clone git@github-work.crosskeys:org-name/repo.git
```

Git and SSH will automatically use the correct identity and configuration managed by `crosskeys`.

---

## FAQs

**Q: Where are my credentials stored?**

A: Your credentials are stored in your macOS Keychain. (This tool currently supports macOS only.)

**Q: Is there support for Windows and Linux?**

A: Not yet. Currently, there is no support for Windows or Linux. Support may be added in the future if there is a need or demand.
