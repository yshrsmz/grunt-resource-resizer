grunt-resource-resizer
======================


```javascript
rr: {
    test: {
        options: {
            sourceRatio: 4,
            output: {
                xhdpi: {
                    pixelRatio: 2,
                    dir: 'drawable-xhdpi/'  // output directory
                },
                xxhdpi: {
                    pixelRatio: 3,
                    dir: 'drawable-xxhdpi/'
                },
                xxxhdpi: {
                    pixelRatio: 4,
                    dir: 'drawable-xxxhdpi/'
                }
            }
        },
        files: {
            // [output base path] : [source images pattern]
            './tmp/res/': 'test/res/drawable-xxxhdpi/*.png'
        }
    }
}
```
