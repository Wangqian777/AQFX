$(function() {
	// 初始化Table
	btTableInit = function() {
		$('#tb_datamodel').bootstrapTable({
			url : '../../getPageData.do', // 请求后台的URL（*）
			method : 'get', // 请求方式（*）
			toolbar : '#toolbar', // 工具按钮用哪个容器
			striped : true, // 是否显示行间隔色
			cache : false, // 是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
			pagination : true, // 是否显示分页（*）
			sortable : true, // 是否启用排序
			sortOrder : "asc", // 排序方式
			//sortName:"",
			queryParamsType : "a",
			queryParams : dbQueryParams, // 传递参数（*）
			sidePagination : "server", // 分页方式：client客户端分页，server服务端分页（*）
			pageSize : 10, // 每页的记录行数（*）
			clickToSelect : true, // 是否启用点击选中行
			// height: 500, //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
			uniqueId : "ID", // 每一行的唯一标识，一般为主键列
			responseHandler : function(data) {
				return data;
			},

			onDblClickRow : function(item, $element) {
				localStorage.FormMode = "View";
				localStorage.BillId = item["ID"];

				openFormCard(localStorage.mid, "查看");

				return false;
			},
			onClickRow : function(item, $element) {

				// localStorage不能直接存JS对象

				localStorage.FormMode = "View";
				localStorage.BillId = item["ID"];
				return false;
			},
			onSort : function(name, order) {

				localStorage.orderydjhtb = name + " " + order;

				return false;
			},
			columns : [ {
				checkbox : true,
				width : '1%'
			}, {
				field : '类型',
				title : '法规类别',
				sortable : true,
				valign : 'middle',
			}, {
				field : '单据时间',
				title : '发布时间',
				sortable : true,
				valign : 'middle',
			}, {
				field : '标题',
				title : '法规标题',
				sortable : true,
				valign : 'middle',
			} ],
		});
	};
	// 请求参数
	dbQueryParams = function(params) {
		let json = {
			'table' : $("#tb_datamodel").data("table"),
			'params' : JSON.stringify(params)
		};
		return json;
	};
	btTableInit();
	
	// 打开卡片窗体
	function openFormCard(billId, mode) {
		// var apidata = "{\"json\":[\"" + billId + "\",\"" + "" + "\"]}";
		var index = top.window.layer.open({
			type : 2,
			title : '<span style="font-size:14px;font-weight: bold;">月度计划填报 - '
					+ mode + '<span>',
			closeBtn : 1,
			shadeClose : false, // 单击遮罩能否关闭
			maxmin : true, // 开启最大化最小化按钮
			area : [ '860px', '500px' ],
			content : '/YMJYGL/views/ydjhtb/form_md.html',
			// offset: [38, e.clientX - 245]
			cancel : function(index, layero) {
				top.window.layer.close(index);
				// alert("cancel")
				return false;
			},
			// close: function (index) {
			// alert("close")
			// },
			end : function() {
				// alert("end")
				// http://layer.layui.com/1.8.5/api.html
				$('#tb_datamodel').bootstrapTable('refresh'); // 不刷新
				btTableInit();
				top.window.layer.close(index);
				return false;
			}
		});

		localStorage.layerindex = index; // 用于关闭层
	}
	// ---------------------------------------
	
	// bootstrap table
	var mid = localStorage.mid;

	// ---导入按钮
	$("#btntable-import").off("click").on("click", function() {

		localStorage.FormMode = "Import";
		// openFormCard("9bdfcae8-b010-46d1-a8ad-346ce7d9efb1", "导入");
		openFormExcelCard(localStorage.mid, "导入");
	});
	// -----
	$("#btntable-view").off("click").on("click", function() {
		var listdata = $('#tb_datamodel').bootstrapTable('getAllSelections');
		if (listdata.length <= 0) {
			top.window.layer.msg('请选择有效数据！');
			return;
		}
		localStorage.FormAction = "R";
		localStorage.FormMode = "View";
		// openFormCard("9bdfcae8-b010-46d1-a8ad-346ce7d9efb1", "查看");
		openFormCard(localStorage.mid, "查看");
	});
	// --------------------------------
	$("#btntable-add").off("click").on("click", function() {
		localStorage.FormMode = "Add";
		localStorage.FormAction = "BC";
		// openFormCard("9bdfcae8-b010-46d1-a8ad-346ce7d9efb1", "添加");
		openFormCard(localStorage.mid, "添加");
	});

	// --------------
	$("#btntable-edit").off("click").on("click", function() {
		var listdata = $('#tb_datamodel').bootstrapTable('getAllSelections');
		if (listdata.length <= 0) {
			top.window.layer.msg('请选择有效数据！');
			return;
		}
		localStorage.FormAction = "M";
		localStorage.FormMode = "Edit";
		// openFormCard("9bdfcae8-b010-46d1-a8ad-346ce7d9efb1", "编辑");
		openFormCard(localStorage.mid, "编辑");
	});
	//
	$("#btntable-refresh").off("click").on("click", function() {
		localStorage.ListQueryJson = "";
		$('#tb_datamodel').bootstrapTable('destroy'); // 不刷新
		btTableInit();
	});

	$("#btntable-search").off("click").on("click", function() {
		localStorage.FormMode = "Search";
		// openFormQueryCard("9bdfcae8-b010-46d1-a8ad-346ce7d9efb1", "查询");

		openFormQueryCard(localStorage.mid, "查询");
	});

	$("#btntable-delete").off("click").on("click", function() {
		var listdata = $('#tb_datamodel').bootstrapTable('getAllSelections');
		if (listdata.length <= 0) {
			top.window.layer.msg('请选择有效数据！');
			return;
		}
		localStorage.FormAction = "D";
		localStorage.FormMode = "Delete";
		// 询问框
		var index = top.window.layer.confirm('您确定要删除么？', {
			btn : [ '确定', '取消' ]
		// 按钮
		}, function() {
			localStorage.FormMode = "Delete";
			openFormCard(localStorage.mid, "删除");
			top.window.layer.close(index);
		}, function() {
			top.window.layer.close(index);
		});

	});

	// ----------------------

});