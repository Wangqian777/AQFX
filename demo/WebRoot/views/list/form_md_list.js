 $(function(){
	 var btColumnsConfig=[{checkbox: true,width: '1%'}];
	 var menuId=window.location.href.split("?")[1].split("=")[1];
	 
	 $.ajax({
		 url:"../../getMenuColumn.do",
		 type:"POST",
		 data:{"menuId":menuId},
		 dataType:"JSON",
		 success:function(data){
			 localStorage.listSql=data.listSql[0].列表sql;
			 var dt=data.dtlist;
			 for(var i=0;i<dt.length;i++){
				 btColumnsConfig.push({field: dt[i].列名, title: dt[i].列名});
			 }
			 TableInit();
		 }
	 });
	 dbQueryParams = function (params) {
	        var temp = {
	            "listSql":  localStorage.listSql
	        };
	        return temp;
	    };
		var TableInit = function () {
			$('#tb_datamodel').bootstrapTable({
	            url: '../../getListData.do',         //请求后台的URL（*）
	            method: 'get',                      //请求方式（*）
	            toolbar: '#toolbar01',                //工具按钮用哪个容器
	            striped: true,                      //是否显示行间隔色
	            cache: false,                       //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
	            sortable: false,                     //是否启用排序
	            sortOrder: "asc",                   //排序方式
	            queryParams: dbQueryParams,//传递参数（*）
	            search: false,                       //是否显示表格搜索，此搜索是客户端搜索，不会进服务端，所以，个人感觉意义不大
	            strictSearch: false,
	            showColumns: false,                  //是否显示所有的列
	            showRefresh: false,                  //是否显示刷新按钮
	            minimumCountColumns: 2,             //最少允许的列数
	            clickToSelect: true,                //是否启用点击选中行
	            uniqueId: "ID",                     //每一行的唯一标识，一般为主键列
	            showToggle:false,                    //是否显示详细视图和列表视图的切换按钮
	            cardView: false,                    //是否显示详细视图
	            detailView: false,                   //是否显示父子表
	            columns:btColumnsConfig
	            
	      });
		};
		
 });