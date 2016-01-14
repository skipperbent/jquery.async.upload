/**
 * Pecee AsyncUpload for jQuery
 * @version 1.0.3
 * @author Simon Sessingø
 * @website http://www.pecee.dk
 */
function asyncUpload(options) {
	return this.construct(options);
}

asyncUpload.prototype={
	attr: [],
	options: {
		form: '',
		params: {},
		postUrl: null,
		onFileChange: null,
		onLoad: null,
		onComplete: null,
		onError: null
	},
	construct: function(options) {
		this.options = $.extend(this.options, options);
		this.attr = [];
		var o = this.options;

		var errors = new Array();

		if(o.postUrl === null) {
			errors.push('No postUrl defined');
		}

		if(o.form === null || typeof(o.form) === "undefined"){
			errors.push("The form of 1st parameter does not exists.");
		}

		if(o.onComplete === null){
			errors.push("onComplete event must be defined!");
		}

		if(errors.length > 0){
			if(o.onError !== null) {
				o.onError(errors);
			} else {
				throw "Following errors occoured:\n\n" + errors.join('\n');
			}
		}

		var iframe = '<iframe id="ajax-temp" name="ajax-temp" width="0" height="0" border="0" style="width:0;height:0;border:none;"></iframe>';
		o.form.append(iframe);
		var f = window.frames['ajax-temp'];
		f.name = "ajax-temp";

		this.addAttribute('target', 'ajax-temp');
		this.addAttribute('action', o.postUrl);
		this.addAttribute('method', 'post');
		this.addAttribute('enctype', 'multipart/form-data');
		this.addAttribute('encoding', 'multipart/form-data');

        var params = [];

        // Add custom parameters
        for( var param in o.params ) {
            params.push(param);
            var input = $('<input type="hidden" name="'+ param +'" value="'+ o.params[param] +'" />');
            o.form.append(input);
        }

		if(o.onLoad !== null) {
			o.onLoad();
		}

		o.form.submit();

		$('#ajax-temp').load(function() {
			var response = $(this).contents().find('body').html();
			response = response.substr(response.indexOf('{'));
			response = response.substr(0, response.lastIndexOf('}')+1);
			o.onComplete(JSON.parse(response));
			$(this).remove();
		});

		this.restoreAttributes();

        // Remove custom parameters
        if(params.length > 0) {
            for(var i = 0; i < params.length; i++) {
                $('input[name="'+ params[i] +'"]').remove();
            }
        }
	},
	addAttribute: function(name, value) {
		var v = (this.options.form.attr(name)) ? this.options.form.attr(name) : null;
		this.attr.push(new Array(name, v));
		this.options.form.attr(name, value);
	},
	restoreAttributes: function() {
		for(var i = 0; i < this.attr.length; i++) {
			var arr=this.attr[i];
			if(arr[1] == null) {
				this.options.form.removeAttr(arr[0]);
			} else {
				this.options.form.attr(arr[0], arr[1]);
			}
		}
		this.options.form.find('input[type="file"]').attr('value', '');
	}
};

jQuery.fn.asyncUpload = function (options) {
	$(this).each(function() {
		var self = $(this);
		var form = self.parents('form:first');
		if(form.length === 0) {
			throw 'Cannot find form!';
		}

		var o = $.extend(options, { 'form': form });

		$(this).bind('change', function() {
			var upload = new asyncUpload(o);
			if(o.onFileChange != null) {
				o.onFileChange(self.o, upload);
			}
			return upload;
		});
	});
};
