# jquery.async.upload
Simple, lightweight jQuery plugin that enables async file upload.

## Example

```html
<form>
	<input type="file" name="image" id="picture" />
</form>

<script>
	$(document).ready(function() {
		$('#picture').asyncUpload({
		      postUrl: '/file/upload-image', 
		      onComplete: function(response) {
		        // Triggers when file has been uploadet
		      },
		      onError: function(errors) {
		        // Triggers when an error occur 
		      },
		      onLoad: function() {
		        // Triggers when the hidden form has been loaded
		      },
		      onFileChange: function() {
		        // Triggers when file has been chosen or changed
		      }
	    });
	});
</script>
```
