$(function() {
	// 初始化Table
	btTableInit = function() {
		$('#table').bootstrapTable({
			url : '../../getPageData.do', // 请求后台的URL（*）
			method : 'get', // 请求方式（*）
			toolbar : '#toolbar', // 工具按钮用哪个容器
			striped : true, // 是否显示行间隔色
			cache : false, // 是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
			pagination : true, // 是否显示分页（*）
			sortable : true, // 是否启用排序
			sortOrder : "asc", // 排序方式
			// sortName:"",
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
			'table' : $("#table").data("table"),
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
	
	// 新增
	$("#btntable-add").click(function() {
		localStorage.FormMode = "Add";
		let title = this.innerText.trim() + $("#table").data("table")
		openFormCard("form_md.html", title);
	});
	// 导入
	$("#btntable-import").click(function() {

		localStorage.FormMode = "Import";
		// openFormCard("9bdfcae8-b010-46d1-a8ad-346ce7d9efb1", "导入");
		openFormExcelCard(localStorage.mid, "导入");
	});
	// 查看
	$("#btntable-view").off("click").on("click", function() {
		var dataArray = $("#table").bootstrapTable('getSelections');
		if (dataArray.length == 0) {
			layer.msg("请选择数据行！");
			return;
		}
		localStorage.cgbsId = dataArray[0].ID;
		localStorage.FormAction = "R";
		localStorage.FormMode = "View";
		let title = this.innerText.trim() + $("#table").data("table")
		openFormCard("form_md.html", title);
	});
	// 编辑
	$("#btntable-edit").click(function() {
		var dataArray = $("#table").bootstrapTable('getSelections');
		if (dataArray.length == 0) {
			layer.msg("请选择数据行！");
			return;
		}
		localStorage.cgbsId = dataArray[0].ID;
		localStorage.FormMode = "Edit";
		let title = this.innerText.trim() + $("#table").data("table")
		openFormCard("form_md.html", title);
	});
	// 删除
	$("#btntable-delete").click(function() {
		var dataArray = $("#table").bootstrapTable('getSelections');
		if (dataArray.length == 0) {
			layer.msg("请选择数据行！");
			return;
		}
		localStorage.cgbsId = dataArray[0].ID;
		layer.confirm('确认删除吗？', {
			btn : [ '确定', '取消' ]
		// 按钮
		}, function(index) {
			layer.close(index);
			var json = {
				"zhubiao" : "辨识评估",
				"zhubiaoID" : localStorage.cgbsId
			};
			FormAction(json, "D");
		});
	});
	// 刷新
	$("#btntable-refresh").click(function() {
		$('#table').bootstrapTable('refresh');
	});

	// 打开卡片窗体
	function openFormCard(url, title) {
		layer.open({
			type : 2,
			title : '<span style="font-size:14px;font-weight: bold;">' + title + '<span>',
			maxmin : true,
			shadeClose : true,
			offset : 'auto',
			area : [ '900px', '600px' ],
			content : [ url ],
			end : function() {
				$("#table").bootstrapTable('refresh');
			}
		});
	}
	// 提交表单
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
					$("#table").bootstrapTable('refresh');
				} else {
					layer.msg("操作失败");
				}
			}
		});
	}
	function bindTitle() {
		let title = ""
		const mode = localStorage.FormMode
		switch (mode) {
		case "Add":
			title = "新增"
			break;
		case "Edit":
			title = "编辑"
			break;

		default:
			break;
		}
		return $("#table").data("table")
	}
});