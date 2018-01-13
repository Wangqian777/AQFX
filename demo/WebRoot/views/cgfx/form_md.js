$(function(){
	$('#date').datetimepicker({  
        format: 'YYYY-MM-DD',  
        locale: moment.locale('zh-cn')  
    });
	if(localStorage.FormMode=="Edit" || localStorage.FormMode=="View"){
		$("#btntable-reset").attr("disabled","true");
		var json = { "ID": localStorage.cgbsId,"单据类型":"常规风险","table":"风险清单"};
		var __str= JSON.stringify(json);
		$.ajax({
			url:"../../getListData.do",
			type:"POST",
			data:{"v_json":__str},
			dataType:"JSON",
			success:function(data){
				$("#frmdata").fill(data[0], { styleElementName: 'none' });
				$("#id").val(data[0].ID);
			}
		});
		
		if(localStorage.FormMode=="View"){
			$('input,select,textarea',$('#frmdata')).prop('readonly',true);
			$("button[type=button]").attr("disabled","true");
		}
	}
	
	
	
	$("#btntable-save").click(function(){
		var json = {};
		var action="";
		var data;
		if(localStorage.FormMode=="Add"){
			action="C";
		}else if(localStorage.FormMode=="Edit"){
	        action="M";
		}
		data = $("#frmdata").serializeObject();
		json.table = $("#frmdata").data("table");
        json.tabledata = data;
        FormAction(json,action);
		
	});
	$("#btntable-reset").click(function(){
		$("#frmdata :input").not(":button, :submit, :reset,  :checkbox, :radio").val("");  
        $("#frmdata :input").removeAttr("checked").remove("selected");
        $("#单据类型").val("常规风险");
	});
	function FormAction(data,action){
		var __str= JSON.stringify(data);
		$.ajax({
			type:"POST",
			url:"../../SingleJson.do",
			data:{"v_json":__str,"action":action},
			dataType:"JSON",
			async:false,
			success:function(data){
				if(data.state==1){
					layer.msg("操作成功");
				}else{
					layer.msg("操作失败");
				}
			}
		});
	}
﻿
});