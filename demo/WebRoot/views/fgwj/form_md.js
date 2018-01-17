$(function() {
	var List = new Array();//定义一个全局变量去接受文件名和id
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
		layoutTemplates:{actionDelete:''},
		// maxFileSize : 0,
	});

	// 上传文件成功，回调函数
	$('#file').on("fileuploaded", function(event, data, previewId, index) {
		if (data.response.state > 0) {
			var url = data.response.data;
			var html="<tr ><td name='文件路径'>"+url+"</td><td name='文件名称'>"+data.filenames[0]+"</td></tr>";
			$("#附件信息").append(html);
			List.push({ FileName: data.filenames[0], KeyID: previewId });
		}
	});
	$('#file').on('filesuccessremove', function(event, data, previewId, index) {
		 for (var i = 0; i < List.length; i++) { 
		      if (List[i].KeyID== data) { 
		        console.log( List[i]); 
		      } 
		   }
	});
	$('#date').datetimepicker({
		format : 'YYYY-MM-DD',
		locale : moment.locale('zh-cn')
	});
	dbQueryParams = function (params) {

		params.FID=localStorage.fgwjId;
        var temp = {
            'params' : JSON.stringify(params),
            'table':'附件'
        };
        return temp;
    };
	function TableInit() {
		$('#table').bootstrapTable({
            url: '../../getPageData.do',         //请求后台的URL（*）
            method: 'get',                      //请求方式（*）
            striped: true,                      //是否显示行间隔色
            cache: false,                       //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
            pagination: true,                   //是否显示分页（*）
            sortable: false,                     //是否启用排序
            sortOrder: "asc",                   //排序方式
            queryParamsType : "a",
            queryParams: dbQueryParams,			//传递参数（*）
            sidePagination: "server",           //分页方式：client客户端分页，server服务端分页（*）
            pageNumber:1,                       //初始化加载第一页，默认第一页
            pageSize: 10,                       //每页的记录行数（*）
            pageList: [10, 25, 50, 100],        //可供选择的每页的行数（*）
            search: false,                       //是否显示表格搜索，此搜索是客户端搜索，不会进服务端，所以，个人感觉意义不大
            strictSearch: true,
            showColumns: false,                  //是否显示所有的列
            showRefresh: false,                  //是否显示刷新按钮
            minimumCountColumns: 2,             //最少允许的列数
            clickToSelect: true,                //是否启用点击选中行
            height: 500,                        //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
            uniqueId: "ID",                     //每一行的唯一标识，一般为主键列
            showToggle:false,                    //是否显示详细视图和列表视图的切换按钮
            cardView: false,                    //是否显示详细视图
            detailView: false,                   //是否显示父子表
            singleSelect : true,				//单选 
            columns: [{
                checkbox: true
            },{
            	field:'ID',
            	title:'ID',
            	visible:false
            }, {
            	field: '文件名称',
                title: '文件名称',
                valign: 'middle',
                visible: true
                
            } , {
            	field: '文件路径',
                title: '文件路径',
                valign: 'middle',
                visible: true
            } ]
        });
	};
	TableInit();
	if (localStorage.FormMode == "Edit") {
		$("#附件表").css("display","block");
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
			action = "MC";
		}
		data = $("#frmdata").serializeObject();
		json.table = $("#frmdata").data("table");
		json.tabledata = data;
		json.dtables = [];
		$("#附件信息").find("tr").each(function () {
			var tempjson={};
			tempjson.文件路径=$(this).children('td:eq(0)').text();
			tempjson.文件名称=$(this).children('td:eq(1)').text();
			json.dtables.push({ table: '附件', tabledata: tempjson });
		});
		console.log(json);
		FormAction(json, action);
	});
	function FormAction(data, action) {
		var __str = JSON.stringify(data);
		$.ajax({
			type : "POST",
			url : "../../manyJson.do",
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
