$(function() {
	$('#btntable-save').on('click', function() {// 提交图片信息 //
		// 先上传文件，然后在回调函数提交表单
		$('#file').fileinput('upload');
	});
	var url1 = 'http://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/FullMoon2010.jpg/631px-FullMoon2010.jpg', url2 = 'http://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Earth_Eastern_Hemisphere.jpg/600px-Earth_Eastern_Hemisphere.jpg';
	$('#file').fileinput({// 初始化上传文件框
		uploadUrl : "../../upload.do",
		// allowedFileExtensions : ["jpg", "png","gif"],/*上传文件格式*/
		deleteUrl : "../../delete.do",
		language : "zh",// 配置语言
		dropZoneEnabled : false,
		showUpload : false,
		showRemove : false,
		showCaption : false,// 是否显示标题
		uploadAsync : true,
		enctype : 'multipart/form-data',
		overwriteInitial : false,
		maxFileCount : 1,
	// maxFileSize : 0,
	});

	// 上传文件成功，回调函数
	$('#file').on("fileuploaded", function(event, data, previewId, index) {

		if (data.response.state > 0) {
			var url = data.response.data;
			$('#地址').val(url);
			$('#文件名称').val(data.filenames[0]);
		}
		// 如果是上传多张图，计数标记，用于确保全部图片都上传成功了，再提交表单信息
		// var fileCount = $('#file-pic').fileinput('getFilesCount');
		save();
	});
	$('#date').datetimepicker({
		format : 'YYYY-MM-DD',
		locale : moment.locale('zh-cn')
	});
	if (localStorage.FormMode == "Edit") {
		var json = {
			"ID" : localStorage.fgwjId
		};
		var __str = JSON.stringify(json);
		$.ajax({
			url : "../../getIdentificationList.do",
			type : "POST",
			data : {
				"v_json" : __str
			},
			dataType : "JSON",
			success : function(data) {
				$("#frmdata").fill(data[0], {
					styleElementName : 'none'
				});
				$("#id").val(data[0].ID);
			}
		});
	}

	function save() {
		var json = {};
		var action = "";
		var data;
		if (localStorage.FormMode == "Add") {
			action = "C";
		} else if (localStorage.FormMode == "Edit") {
			action = "M";
		}
		data = $("#frmdata").serializeObject();
		json.table = $("#frmdata").data("table");
		json.tabledata = data;
		FormAction(json, action);

	}
	;
	function FormAction(data, action) {
		var __str = JSON.stringify(data);
		$.ajax({
			type : "POST",
			url : "../../SingleJson.do",
			data : {
				"v_json" : __str,
				"action" : action
			},
			dataType : "JSON",
			async : false,
			success : function(data) {
				if (data.state == 1) {
					layer.msg("操作成功");
					top.window.layer.close(localStorage.layerindex);
				} else {
					layer.msg("操作失败");
				}
			}
		});
	}
})
