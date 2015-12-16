/**
 * Pecee AsyncUpload for jQuery
 * By: Simon Sessingø
 * @version 0.5
 * @author Pecee
 * @website http://www.pecee.dk
 */
function asyncUpload(options) {
	return this.construct(options);
}

asyncUpload.prototype={
	attr: [],
	options: {
		form: '',
		postUrl: null,
		onFileChange: null,
		onLoad: null,
		onComplete: null,
		onError:null
	},
	construct: function(options) {
		this.options=$.extend(this.options, options);
		this.attr=[];
		var o=this.options;

		var errors=new Array();
		if(o.postUrl==null) {
			errors.push('No postUrl defined');
		}
		if(o.form==null || typeof(o.form)=="undefined"){
			errors.push("The form of 1st parameter does not exists.");
		}
		if(o.onComplete == null){
			errors.push("onComplete event must be defined!");
		}
		if(errors.length>0){
			if(o.onError!=null) {
				o.onError(errors);
			} else {
				throw "Following errors occoured:\n\n" + errors.join('\n');
			}
		}
		var iframe='<iframe id="ajax-temp" name="ajax-temp" width="0" height="0" border="0" style="width:0;height:0;border:none;"></iframe>';
		o.form.append(iframe);
		var f=window.frames['ajax-temp'];
		f.name="ajax-temp";

		this.addAttribute('target', 'ajax-temp');
		this.addAttribute('action', o.postUrl);
		this.addAttribute('method', 'post');
		this.addAttribute('enctype', 'multipart/form-data');
		this.addAttribute('encoding', 'multipart/form-data');
		if(o.onLoad!=null) {
			o.onLoad();
		}
		o.form.submit();
		$('#ajax-temp').load(function() {
			o.onComplete($(this).contents().find('body').html());
			$(this).remove();
		});
		this.restoreAttributes();
	},
	addAttribute: function(name, value) {
		var v=(this.options.form.attr(name)) ? this.options.form.attr(name) : null;
		this.attr.push(new Array(name, v));
		this.options.form.attr(name, value);
	},
	restoreAttributes: function() {
		for(var i=0;i<this.attr.length;i++) {
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
	var self=this;
	var form = self.parents('form:first');
	if(form.length == 0) {
		throw 'Cannot find form!';
	}
	var s=$.extend(options, { 'form': form });
	$(this).bind('change', function() {
		if(s.onFileChange != null) {
			s.onFileChange(this,self,o);
		}
		return new asyncUpload(s);
	});
};
