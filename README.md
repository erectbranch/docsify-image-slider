<div align="center">

# docsify-image-slider

[![NPM Release](https://img.shields.io/npm/v/docsify-image-slider.svg)](https://www.npmjs.com/package/docsify-image-slider)

A plugin for [Docsify](https://docsify.js.org/#/) that allows you to create a slider for images in your documentation.

![demo](demo.gif)

</div>

## 🔨 Import

To use the image slider, you need to include the plugin in your Docsify `index.html` file:

(Add stylesheet)

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/docsify-image-slider/dist/slider.min.css">
```

(Add script)

```html
<script src="//cdn.jsdelivr.net/npm/docsify-image-slider/dist/docsify-image-slider.min.js"></script>
```

---

## 📋 Usage

To create an image slider, you can use the following syntax in your markdown files:

```html
<div class="image-slider">
    [[slider]](img url 1|img url 2|img url 3|...)
</div>
```

---

## ⚙️ Configuration

To configure the slider, you can set options in your `index.html` file. The available options are:

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `auto` | `Boolean` | false | Whether to automatically switch images. |
| `intervalTime` | `Int` | 20000 | Time interval for automatic switching (in milliseconds). |

```javascript
window.$docsify = {
  slider: {
    // Default options
    auto: false,
    intervalTime: 20000,
  },
};
```

---

## ✨ Contribution

Please feel free to submit a pull request or open an issue on the GitHub repository. Your contributions are welcome and appreciated!

---
