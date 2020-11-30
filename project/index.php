<!DOCTYPE html>
<html>
<head>
	<title>Upload from Canvas</title>
	<style>
		#canvas-area {
			border: 1px solid #ccc;
		}

		#textarea, #preview-pict {
			display: none;
		}
	</style>
</head>
<body>
	<form action="save.php" method="post" id="form_id">
		<div>
			<canvas id="canvas-area" width="300" height="100"></canvas>
			<textarea name="textarea" id="textarea"></textarea>
			<img src="" id="preview-pict">
		</div>
		<div>
			<input type="file" id="btn-upload">
			<button type="submit">Upload</button>
		</div>
	</form>

<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
<script>
	$('#btn-upload').on('change', function() {
		$('#preview-pict').attr('src', window.URL.createObjectURL(this.files[0]))
		
		$('#preview-pict').on('load', function() {
			var image = document.getElementById('preview-pict')

			$('#canvas-area').css('border', 'none')
			$('#canvas-area').attr('width', image.width)
			$('#canvas-area').attr('height', image.height)

			var canvas = document.getElementById('canvas-area')
			var ctx = canvas.getContext('2d')

			ctx.drawImage(image, 0, 0, image.width, image.height)
		})
	})

	$('#form_id').on('submit', function() {
		var canvas = document.getElementById('canvas-area')
		var dataURL = canvas.toDataURL()
		$('#textarea').val(dataURL)
	})
</script>
</body>
</html>