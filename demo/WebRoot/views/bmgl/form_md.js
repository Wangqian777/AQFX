﻿$(function(){
	if(localStorage.PID!=undefined){
		$("#pid").val(localStorage.PID);
	}
	$("#btntable-save1").click(function(){
		 var json = {};
        var data = $("#frmdata").serializeObject(); 
        json.table = $("#frmdata").data("table");
        json.tabledata = data;
        console.log(json);
        FormAction(json,"C");
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
});