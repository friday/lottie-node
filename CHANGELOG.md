# Changelog

# 2.0.0

### Changed

- Breaking: Updated image loading code injection to work with the latest lottie-web (credit to user razvanmitre)
- Breaking: Updated all peer-dependencies
- Explicitly requires Node >=10.0.0
- Formatted with prettier defaults to make it easier for collaborators

# 1.0.0

### Added

- Changelog

### Changed

- Breaking: Updated peer-dependencies for node canvas to the v2 branch, and JSDOM to v13. See their [changelog](https://github.com/Automattic/node-canvas/blob/master/CHANGELOG.md#200) for upgrading instructions (#6).
- Explicitly requires Node >=8.3.0 (needed for object spread)

# 0.2.0

### Changed

- Breaking: Replaced wrapper function with optional `factory()` method for anyone who wants to override the lottie path (#2).

# 0.1.0

Initial release
