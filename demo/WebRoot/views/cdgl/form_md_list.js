$(function(){
	const height = $(this).outerHeight(true)-$('.box-header').outerHeight(true)-2
	$('#left').height(height)
	$('#right').height(height-$('#btns').outerHeight(true))
	initTree();
	function initTree(){
		$.ajax({
			type:"POST",
			url:"../../getTreeJson.do",
			dataType:"JSON",
			async:false,
			success:function(data){
				$('#treeview').treeview({
	                data: data,         // 数据源
	                showCheckbox: false,   //是否显示复选框
	                highlightSelected: true,    //是否高亮选中
	                emptyIcon: '',    //没有子节点的节点图标
	                multiSelect: false,    //多选
	                onNodeChecked: function (event,data) {
	                	
	                },
	                onNodeSelected: function (event, data) {
	                	$("#id").val(data["ID"]);
	                	$("#pid").val(data["PID"]);
	                	$("#编码").val(data["编码"]);
	                	$("#名称").val(data["text"]);
	                	$("#图标名").val(data["图标名"]);
	                	$("#路径").val(data["路径"]);
	                	
	                	
	                }
	            });
				
			}
		});
	}
	 
	 function openFormQueryCard(mode) {
		 	var index = top.window.layer.open({
	            type: 2,
	            title: '<span style="font-size:14px;font-weight: bold;">'+mode+'<span>',
	            closeBtn: 1,
	            shadeClose: true, //单击遮罩能否关闭
	            maxmin: true, //开启最大化最小化按钮
	            area: ['860px', '500px'],
	            content: 'views/cdgl/form_md.html',
	            cancel: function (index, layero) {
	               
	            },
	            end: function () {
	            	initTree();
	            }
	        });

	        localStorage.layerindex = index; //用于关闭层
	 }
	 $("#btntable-save").click(function(){
		 if($("#id").val()==""){
			 layer.msg("请选择左侧节点");
			 return;
		 }
		 var json = {};
         var data = $("#frmdata").serializeObject(); 
         json.table = $("#frmdata").data("table");
         json.tabledata = data;
         FormAction(json,"M");
	 });
	 $("#btntable-addtj").click(function(){
		 if($("#id").val()==""){
			 layer.msg("请选择左侧节点");
			 return;
		 }
		 localStorage.PID=$("#pid").val();
		 openFormQueryCard("新增同级");
		 
	 });
	 $("#btntable-addxj").click(function(){
		 if($("#id").val()==""){
			 layer.msg("请选择左侧节点");
			 return;
		 }
		 localStorage.PID=$("#id").val();
		 openFormQueryCard("新增下级");
		 
	 });
	 $("#btntable-delete").click(function(){
		 var flag=true;
		 if($("#id").val()==""){
			 layer.msg("请选择左侧节点");
			 return;
		 }
		 
		 $.ajax({
			 url:"../../getDataCounts.do",
			 type:"POST",
			 data:{"id":$("#id").val(),"table":"菜单"},
			 dataType:"JSON",
			 asnyc:false,
			 success:function(data){
				 if(data.json.State==0){
					 flag=false;
				 }
				 if(flag){
					 var json = {};
			         var data = $("#frmdata").serializeObject(); 
			         json.table = $("#frmdata").data("table");
			         json.tabledata = data;
			         json.dtables = [];
			         var allTableData = $("#tb_departments").bootstrapTable('getData');
			         for(var i=0;i<allTableData.length;i++){
			        	 allTableData[i].FID=$("#id").val();
			        	 allTableData[i].table=$("#tb_departments").data("table"),
			        	 json.dtables.push({tabledata: allTableData[i] });
			         } 
			         FormAction(json,"D");
				 }else{
					 layer.msg("存在子节点，无法删除");
				 } 
			 }
		 });
		 
	 });
	 
	 function FormAction(data,action){
		 var __str= JSON.stringify(data);
		 $.ajax({
				type:"POST",
				url:"../../menuManage.do",
				data:{"v_json":__str,"action":action},
				dataType:"JSON",
				async:false,
				success:function(data){
					if(data.json.State==1){
						layer.msg("操作成功");
						initTree();
					}else{
						layer.msg("操作失败");
						initTree();
					}
				}
			});
	 }
	 
});