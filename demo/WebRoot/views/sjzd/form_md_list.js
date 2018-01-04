$(function(){
	const height = $(this).outerHeight(true)-$('.box-header').outerHeight(true)-2
	$('#left').height(height)
	$('#right').height(height-$('#btns').outerHeight(true))
	dbQueryParams = function (params) {
        var temp = {
            "tableName": localStorage.tableName,
        };
        return temp;
    };
	var TableInit = function () {
		$('#tb_departments').bootstrapTable({
            url: '../../getDBTable_mx.do',         //请求后台的URL（*）
            method: 'get',                      //请求方式（*）
            toolbar: '#toolbar',                //工具按钮用哪个容器
            striped: true,                      //是否显示行间隔色
            cache: false,                       //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
            sortable: false,                     //是否启用排序
            sortOrder: "asc",                   //排序方式
            queryParams: dbQueryParams,//传递参数（*）
            search: true,                       //是否显示表格搜索，此搜索是客户端搜索，不会进服务端，所以，个人感觉意义不大
            strictSearch: true,
            showColumns: true,                  //是否显示所有的列
            showRefresh: true,                  //是否显示刷新按钮
            minimumCountColumns: 2,             //最少允许的列数
            clickToSelect: true,                //是否启用点击选中行
            height: 600,                        //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
            uniqueId: "ID",                     //每一行的唯一标识，一般为主键列
            showToggle:true,                    //是否显示详细视图和列表视图的切换按钮
            cardView: false,                    //是否显示详细视图
            detailView: false,                   //是否显示父子表
            columns: [{
                checkbox: true
            }, {
                field: 'COLUMN_NAME',
                title: '列名'
            }, {
                field: 'DATA_TYPE',
                title: '数据类型'
            }, {
                field: 'CHARACTER_MAXIMUM_LENGTH',
                title: '数据长度'
            }, {
                field: 'IS_NULLABLE',
                title: '允许null值'
            }, ]
        });
	};
	$.ajax({
		url:"../../getDatadictionaryList.do",
		type:"POST",
		dataType:"JSON",
		async:false,
		success:function(data){
			var ulHtml="<ul class='list-group'>";
			for(var i=0;i<data.length;i++){
				if(i==0)
					localStorage.tableName=data[i].name;
				ulHtml+="<li class='list-group-item'>"+data[i].name+"</li>";
			}
			ulHtml+="</ul>";
			$("#list").html(ulHtml);
			$(".list-group-item").eq(0).css({"background-color":"#428BCA","color":"#FFFFFF"});
		}
	});
	$(".list-group-item").click(function(){
		$(this).css({"background-color":"#428BCA","color":"#FFFFFF"});
		$(this).siblings().css({"background-color":"#FFFFFF","color":"#333333"});
		localStorage.tableName=$(this).text();
		$("#tb_departments").bootstrapTable('refresh'); 
	});
	$("#add").click(function(){
		layer.open({
			type:2,
			title:"新增数据字典类别",
			maxmin:true,
			shadeClose:true,
			offset:'auto',
			area:['800px','500px'],
			content:["form_md.html",'no']
		});
		
	});
});