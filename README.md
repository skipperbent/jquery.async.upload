# jquery.async.upload
Simple, lightweight jQuery plugin that enables async upload.

## Example

```html
<input type="file" name="image" id="picture" />

<script>
  $(document).ready(function() {
    $('#picture').asyncUpload({
  	  postUrl: '/file/upload-image', 
      onComplete: function(response) {
        // Do stuff
      }
  });
</script>
```
