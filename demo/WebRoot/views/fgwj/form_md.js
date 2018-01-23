$(function() {
	$.ajax({
		url:"../../getDatadictionaryByType.do",
		type:"POST",
		data:{"type":"法规文件"},
		dataType:"JSON",
		success:function(data){
			var selectHtml="";
			for(var i=0;i<data.length;i++){
				selectHtml+="<option  value='"+data[i].ID+"'>"+data[i].名称+"</option>";
			}
			$("#详细类别").html(selectHtml);
			//$(".list-group-item").eq(0).css({"background-color":"#428BCA","color":"#FFFFFF"});
		}
	});
	if (localStorage.FormMode == "Edit" || localStorage.FormMode == "View") {
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
		if(localStorage.FormMode == "View"){
			$('input,select,textarea',$('#frmdata')).prop('readonly',true);
			$("button[type=button]").attr("disabled","true");
			$("#详细类别").attr("disabled","disabled");
		}
	}
	$('#date').datetimepicker({
		format : 'YYYY-MM-DD',
		locale : moment.locale('zh-cn')
	});
	//上传start
	var fileCounts=0;
	var counts=0;
	var url1 = 'http://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/FullMoon2010.jpg/631px-FullMoon2010.jpg';
	var url2 = 'http://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Earth_Eastern_Hemisphere.jpg/600px-Earth_Eastern_Hemisphere.jpg';
	$('#file').fileinput({// 初始化上传文件框
		language: 'zh', //设置语言
        uploadUrl: "../../uploadFile.do", //上传的地址
        showUpload: false, //是否显示上传按钮
        showCaption: false,//是否显示标题
        showRemove:false,
        browseClass: "btn btn-primary", //按钮样式     
        dropZoneEnabled: false,//是否显示拖拽区域
        maxFileCount: 10, //表示允许同时上传的最大文件个数
        enctype: 'multipart/form-data',
        validateInitialCount:true,
        uploadAsync:true,
        previewFileIcon: "<i class='glyphicon glyphicon-king'></i>",
        layoutTemplates:{actionUpload:'',actionDelete:''},
        //
	});

	// 上传文件成功，回调函数
	var urlArry=new Array(fileCounts);
	$('#file').on("fileuploaded", function(event, data, previewId, index) {
		if (data.response.state > 0) {
			var url = data.response.data;
			var filename=url.substring(url.lastIndexOf("\\")+1,url.lastIndexOf("."));
			filename=filename.substring(0,filename.length-13);
			filename+=url.substring(url.lastIndexOf("."),url.length);
			var html="<tr ><td name='文件路径'>"+url+"</td><td name='文件名称'>"+filename+"</td></tr>";
			$("#附件信息").append(html);
			counts++;
			if(fileCounts==counts){
				fileCounts=0;
				counts=0;
				formSave();
			}
		}
	});
	$('#file').on('filedeleted', function(event, id) {
	    console.log("1111");
	});
	//清空事件
	$("#file").on("filecleared",function(event, data, msg){
		fileCounts=0;
	});
	$("#file").change(function(){
		fileCounts+=1;
	});
	//上传end
	
	
	dbQueryParams = function (params) {
		var listSql="select * from 附件 where FID='"+localStorage.fgwjId+"'";
        var temp = {
            'params' : JSON.stringify(params),
            'listSql':listSql
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
                visible: true,
                align:"center",
                
                
            } , {
            	field: '文件路径',
                title: '文件路径',
                valign: 'middle',
                visible: false
                
            }  , {
            	field: '下载',
                title: '下载',
                valign: 'middle',
                visible: true,
                align:"center",
                formatter: function (value, row, index) {  
                	var path=row.文件路径+"";
              		path=path.replace(/\\/g,'%2F');
              		var fileName=row.文件名称+"";
              		html="<a href='../../download.do?path="+path+"&fileName="+fileName+"'>下载文件</a>";
                    return html;
                } 
            }, {
            	field: '预览',
                title: '预览',
                valign: 'middle',
                visible: true,
                align:"center",
                formatter: function (value, row, index) {  
                	var path=row.文件路径+"";
              		//path=path.replace(/\\/g,'%2F');
              		//var fileName=row.文件名称+"";
              		html="<button name='"+path+"' type='button' class='btn-link'><i class='fa fa fa-table'></i>&nbsp;预览</button>";
                    return html;
                } 
            }]
        });
	};
	TableInit();
	$("body").delegate(".btn-link","click", function(){
		localStorage.filePath=$(this).attr("name");
		if(localStorage.filePath!=undefined && localStorage.filePath!=""){
			parent.layer.open({
				type:2,
				title:'<span style="font-size:14px;font-weight: bold;">文档预览<span>',
				maxmin:true,
				shadeClose:true,
				//offset:'auto',
				area:['900px', '600px'],
				content:["../yulan/filePreview.html"],
				maxmin: true,
				end: function(){
				}
			});
		}else{
			layer.msg("预览失败");
		}
	});
	$("#btntable-save").click(function(){
		if(fileCounts!=0){
			$("#file").fileinput("upload");
		}else{
			formSave();
		}
		
	});
	$("#btntable-refreshFile").click(function(){
		$("#table").bootstrapTable('refresh'); 
	});
	$("#btntable-deleteFile").click(function(){
		var dataArray= $("#table").bootstrapTable('getSelections');
		if(dataArray.length==0){
			layer.msg("请选择附件行！");
			return;
		}
		layer.confirm('确认删除吗？', {  
	        btn: ['确定','取消'] //按钮  
	    },function (index) {
	    	layer.close(index);
	    	localStorage.fjId=dataArray[0].ID;
			var filePathArry=new Array();
			filePathArry.push(dataArray[0].文件路径);
			var json={"zhubiao":"附件","zhubiaoID":localStorage.fjId};
			json.wenjian=filePathArry;
			var __str = JSON.stringify(json);
			$.ajax({
				type : "POST",
				url : "../../manyJson.do",
				data : {
					"v_json" : __str,
					"action" : "D"
				},
				dataType : "JSON",
				async : false,
				success : function(data) {
					if (data.state == 1) {
						layer.msg("操作成功");
						$("#table").bootstrapTable('refresh'); 
					} else {
						layer.msg("操作失败");
					}
					
				}
			});
	    });
	});
	function formSave(){
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
		var tab = document.getElementById("附件信息") ;
	    //表格行数
	    var rows = tab.rows.length;
	    if(rows>0){
	    	json.dtables = [];
			$("#附件信息").find("tr").each(function () {
				var tempjson={};
				tempjson.文件路径=$(this).children('td:eq(0)').text();
				tempjson.文件名称=$(this).children('td:eq(1)').text();
				json.dtables.push({ table: '附件', tabledata: tempjson });
			});
	    }
	    FormAction(json, action);
	}
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
					function jump(count) {    
			            window.setTimeout(function(){    
			                count--;    
			                if(count > 0) {      
			                    jump(count);    
			                } else {    
			                	parent.layer.closeAll();   
			                }    
			            }, 1000);    
			        }    
			        jump(1);
					
				} else {
					layer.msg("操作失败");
				}
				
			}
			  
		});
	}
})
