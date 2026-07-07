# Contributing to DrishtiAI

First off, thanks for considering contributing to DrishtiAI! It's people like you that make DrishtiAI such a great tool.

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the issue list as you might find out that you don't need to create one. When you are creating a bug report, please include as many details as possible:

* **Use a clear and descriptive title**
* **Describe the exact steps which reproduce the problem**
* **Provide specific examples to demonstrate the steps**
* **Describe the behavior you observed after following the steps**
* **Explain which behavior you expected to see instead and why**
* **Include screenshots and animated GIFs if possible**
* **Include your environment details**

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, please include:

* **Use a clear and descriptive title**
* **Provide a step-by-step description of the suggested enhancement**
* **Provide specific examples to demonstrate the steps**
* **Describe the current behavior and expected behavior**
* **Explain why this enhancement would be useful**

### Pull Requests

* Fill in the required template
* Follow the JavaScript/Python styleguides
* End all files with a newline
* Avoid platform-dependent code

## Development Setup

1. Fork the repo
2. Clone your fork
3. Follow INSTALLATION.md for setup
4. Create a branch: `git checkout -b feature/your-feature`
5. Make your changes
6. Add tests if applicable
7. Commit: `git commit -am 'Add feature'`
8. Push: `git push origin feature/your-feature`
9. Submit a pull request

## Styleguides

### JavaScript/TypeScript

```javascript
// Use ES6+ syntax
const myFunction = (param) => {
  return param * 2;
};

// Use const by default, let when necessary
const name = 'DrishtiAI';
let counter = 0;

// Use meaningful variable names
const userData = { /* ... */ };
const processVisionFrame = () => { /* ... */ };

// Add comments for complex logic
// This function detects objects in the frame
const detectObjects = (frame) => { /* ... */ };
```

### Python

```python
# Follow PEP 8
def process_frame(frame):
    """Process video frame and return detections."""
    # Implementation
    pass

# Use meaningful names
config_file = 'config.py'
object_detector = ObjectDetector()

# Add docstrings
class ObjectDetector:
    """Detects objects in video frames using YOLOv8."""
    pass
```

## Commit Messages

* Use the present tense ("Add feature" not "Added feature")
* Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
* Limit the first line to 72 characters or less
* Reference issues and pull requests liberally after the first line

## Issue and Pull Request Labels

* `bug` - Something isn't working
* `enhancement` - New feature or request
* `documentation` - Improvements or additions to documentation
* `good first issue` - Good for newcomers
* `help wanted` - Extra attention is needed
* `in progress` - Currently being worked on
* `review needed` - Awaiting review

## Community

* GitHub Issues - Feature requests, bug reports
* GitHub Discussions - General discussion
* Discord - Real-time chat (if available)

## Recognition

Contributors will be recognized in:
* README.md Contributors section
* Release notes
* Project website

## Questions?

Don't hesitate to ask. Open an issue or reach out to maintainers.

Thank you for contributing! 🎉
