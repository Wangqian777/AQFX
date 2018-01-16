$(function() {
	var url1 = 'http://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/FullMoon2010.jpg/631px-FullMoon2010.jpg';
	var url2 = 'http://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Earth_Eastern_Hemisphere.jpg/600px-Earth_Eastern_Hemisphere.jpg';
	$('#file').fileinput({// 初始化上传文件框
		uploadUrl : "../../uploadFile.do",
		// allowedFileExtensions : ["jpg", "png","gif"],/*上传文件格式*/
		deleteUrl : "../../deleteFile.do",
		language : "zh",// 配置语言
		dropZoneEnabled : false,
		showUpload : false,
		showRemove : false,
		showCaption : false,// 是否显示标题
		uploadAsync : true,
		enctype : 'multipart/form-data',
		overwriteInitial : false,
		maxFileCount : 1,
		previewFileIcon: "<i class='glyphicon glyphicon-king'></i>",
		previewFileIconSettings: {
            'xlsx': '<i class="fa fa-file-excel-o text-success"></i>',
            'xls': '<i class="fa fa-file-excel-o text-success"></i>',
            'pptx': '<i class="fa fa-file-powerpoint-o text-danger"></i>',
            'jpg': '<i class="fa fa-file-photo-o text-warning"></i>',
            'pdf': '<i class="fa fa-file-archive-o text-muted"></i>',
            'zip': '<i class="fa fa-file-archive-o text-muted"></i>',
        },
		// maxFileSize : 0,
	});

	// 上传文件成功，回调函数
	$('#file').on("fileuploaded", function(event, data, previewId, index) {

		if (data.response.state > 0) {
			var url = data.response.data;
			$('#文件地址').val(url);
			$('#文件名称').val(data.filenames[0]);
		}
		// 如果是上传多张图，计数标记，用于确保全部图片都上传成功了，再提交表单信息
		// var fileCount = $('#file-pic').fileinput('getFilesCount');
		//save();
	});
	$('#date').datetimepicker({
		format : 'YYYY-MM-DD',
		locale : moment.locale('zh-cn')
	});
	if (localStorage.FormMode == "Edit") {
		var json = { "ID": localStorage.fgwjId,"单据类型":"法规文件","table":"公告警示"};
		var __str = JSON.stringify(json);
		$.ajax({
			url : "../../getListData.do",
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
	$("#btntable-save").click(function(){
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
	});
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
