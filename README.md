# What is this?

### A simple Debug Console inside the HTML itself.

# How to Use?

```html
    <script src="./htmlConsole.js"></script>
    <div id="console-area"></div>
    <script>
        htmlConsole.create(document.getElementById("console-area"));
        console.log("This is magic!");
    </script>
```

# When is this Useful?

### Mostly for debugging websites on a smartphone or a tablet.

# Known issues

### While the console can display uncought errors, it cannot catch **SyntaxErrors**.