$(function(){
	console.log(localStorage.FormMode);
	if(localStorage.FormMode=="Add"){
		$("#frmdata2").hide();
	}else{
		$("#frmdata").hide();
		var json = { "ID": localStorage.listID };
        var __str = JSON.stringify(json);
		$.ajax({
			url:"../../getDatadictionaryList.do",
			type:"POST",
			data:{"v_json":__str},
			dataType:"JSON",
			async:false,
			success:function(data){
				console.log(data);
				$("#frmdata2").fill(data[0], { styleElementName: 'none' });
				$("input[name=是否禁用]").attr("checked",data[0].是否禁用);
			}
		});
		
		
	}
	$("#btntable-save").click(function(){
		var json = {};
		var action="";
		var data;
		if(localStorage.FormMode=="Add"){
			data = $("#frmdata").serializeObject();
			json.table = $("#frmdata").data("table");
			action="C";
		}else{
			data = $("#frmdata2").serializeObject(); 
	        json.table = $("#frmdata2").data("table");
	        action="M";
		}
        json.tabledata = data;
        FormAction(json,action);
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
					if(data.json.State==1){
						layer.msg("操作成功");
					}else{
						layer.msg("操作失败");
					}
				}
			});
	 }
});