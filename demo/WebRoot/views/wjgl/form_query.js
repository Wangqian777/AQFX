$(document).ready(function () {
    bmflag = 1;
    zbflag = 1;
    $(".cm-dropdown-menu").off("click").on("click", function (e) {
        e.stopPropagation();
    })


    //---------------------------
    var isDisabled = true; //禁用
    //----------------
    //修改验证提示信息
    (function ($) {
        $.extend($.validator.messages, {
            required: "必填信息",
            remote: "请修正该信息",
            email: "请输入正确格式的电子邮件",
            url: "请输入合法的网址",
            date: "请输入合法的日期",
            dateISO: "请输入合法的日期 (ISO).",
            number: "请输入合法的数字",
            digits: "只能输入整数",
            creditcard: "请输入合法的信用卡号",
            equalTo: "请再次输入相同的值",
            accept: "请输入拥有合法后缀名的字符串",
            maxlength: $.validator.format("请输入一个长度最多是 {0} 的字符串"),
            minlength: $.validator.format("请输入一个长度最少是 {0} 的字符串"),
            rangelength: $.validator.format("请输入一个长度介于 {0} 和 {1} 之间的字符串"),
            range: $.validator.format("请输入一个介于 {0} 和 {1} 之间的值"),
            max: $.validator.format("请输入一个最大为 {0} 的值"),
            min: $.validator.format("请输入一个最小为 {0} 的值")
        });
    }(jQuery));
    //-------输入器---------------

    //
    $(".input-group-addon").off("click").on("click", function () {
        if (isDisabled) {
            return;
        }
        var $this = $(this);
        //var fields = $(this).data("fields");
        ////alert(fields);
        //var source = $(this).data("source");
        //var display = $(this).data("display");
        ////store-field
        var metaid = $(this).data("metadata-id");
        var iscancel = false;
        ////alert(display);
        //$(this).data("store-field","@@");
        //alert($(this).data("store-field"));
        //var apidata = fields + "||" + source + "||" + display;
        var apidata = metaid;
        var index = top.window.layer.open({
            type: 2,
            title: '<span style="font-size:14px;font-weight: bold;">窗体模式 - ' + "参照" + '<span>',
            closeBtn: 1,
            shadeClose: true,
            maxmin: true, //开启最大化最小化按钮
            area: ['860px', '500px'],
            content: '/BAPI/BAPI_ASHX_HTML.ashx?ticket=' + pub.State.Ticket + '&api=refname&type=string&data=' + apidata + '||R',
            //offset: [38, e.clientX - 245]
            cancel: function (index, layero) {
                //alert("cancel");
                localStorage.refname = "";
                iscancel = true;
                top.window.layer.close(index);
                return false;
            },
            close: function (index) {
                //alert("close");
                ////console.log(localStorage.refname);
                //$this.prev().val(localStorage.refname);
                //top.window.layer.close(index);
                return false;
            },
            end: function () {
                //alert("end");
                // console.log(localStorage.refname);
                //$this.val(localStorage.refname);
                if (!iscancel) {
                    $this.prev().val(localStorage.refname);
                }
                localStorage.refname = "";
                top.window.layer.close(index);
                return false;


            }
        });

        localStorage.layerindex = index; //用于关闭层

    });


    //-------------------------
    //-------------------------
    $("#button-control").off("click").on("click", function () {
        $('#searchresult').css("display", "none")
    })
    $("#button-control1").off("click").on("click", function () {
        $('#searchresult1').css("display", "none")
    })
    //-----------重置-------------------
    $("#btntable-reset").off("click").on("click", function () {
        $('#frmdata')[0].reset()
    })

    //----------search--------------------
    $("#btntable-search").off("click").on("click", function () {
        if ($("#txtModuleType").val() == "")
            $("#部门ID").val(null);
            bmflag = 1;
        if ($("#txtModuleTypezhibiao").val() == "")
            $("#指标ID").val(null);
            zbflag = 1;
        if (bmflag == 0) {
            top.window.layer.msg('选择的部门不存在');
            return;
        };
        if (zbflag == 0) {
            top.window.layer.msg('选择的指标不存在');
            return;
        };
        if (!$("#frmdata").valid()) {
            return false;
        }
        //自动将form表单封装成json ,name属性
        var data = $("#frmdata").serializeObject();
        localStorage.ydjhtbdata = JSON.stringify(data);
        var json = JSON.stringify(data);
        
        json = json.replace(/\"/g, "'");
        localStorage.ListQueryJsonydjhtb = json;
        top.window.layer.close(localStorage.layerindex);


    });
    //----------cancel--------------------
    $("#btntable-cancel").off("click").on("click", function () {
        localStorage.ListQueryJson = "";
        top.window.layer.close(localStorage.layerindex);
    });
    //----------部门模糊查询start--------------------



    $(function () {

        $("#txtModuleType").keyup(function (evt) {
            var arrid = [];
            console.log(arrid);
            ChangeCoords(); //控制查询结果div坐标    
            var k = window.event ? evt.keyCode : evt.which;
            //输入框的id为txt_search，这里监听输入框的keyup事件    
            //不为空 && 不为上箭头或下箭头或回车    
            var json = { "json": [$("#txtModuleType").val(), ""] };
            var __str = JSON.stringify(json);

            bmflag = 0;
            if ($("#txtModuleType").val() != "" && k != 38 && k != 40 && k != 13) {

                $.ajax({
                    type: 'POST',
                    async: true, //同步执行，不然会有问题    
                    dataType: "Json",
                    url: "/BAPI/BAPI_ASHX.ashx",   //提交的页面/方法名    
                    data: { "api": "MC.YMJYGL.Server.YMJYGL.common.Select.BAPI_模糊查询_部门名称", "type": "json", "ticket": pub.State.Ticket, "data": __str },

                    error: function (msg) {//请求失败处理函数    
                        alert("数据加载失败");
                    },
                    success: function (data) { //请求成功后处理函数。    
                        /*  var objData = eval("(" + data.userName + ")");   */
                        console.log(data);
                        console.log(data.json.Data.dtList)

                        if (data.json.Data.dtList.length > 0) {
                           
                            layer = "<table id='worktb'>";
                            $.each(data.json.Data.dtList, function (idx, item) {
                                console.log(item);
                                var id = item.部门ID;
                                arrid.push(id);

                                layer += "<tr class='line'><td class='std'>" + item.名称 + "</td></tr>";

                            });
                            layer += "</table>";

                            //将结果添加到div中        
                            $("#searchresult").empty();
                            $("#searchresult").append(layer);
                            $(".line:first").addClass("hover");
                            $("#searchresult").css("display", "");
                            //鼠标移动事件    


                            $(".line").hover(function () {
                                bmflag = 1;
                                $(".line").removeClass("hover");
                                $(this).addClass("hover");
                                var width = $("#txtModuleType").width() + 25;
                                $(".hover").css("width", width + "px");
                                $(".std").css("width", width + "px");

                                var index = $(this).index();
                                console.log(index);
                                console.log(arrid[index]);
                                $('input[name="部门ID"]').val(arrid[index]);
                                $("#txtModuleType").val($(this).text());
                            }, function () {
                                $(this).removeClass("hover");
                                //$("#searchresult").css("display", "none");    
                            });
                            //鼠标点击事件    
                            $(".line").click(function () {
                                bmflag = 1;
                                var index = $(this).index();
                                console.log(index);
                                console.log(arrid[index]);
                                $('input[name="部门ID"]').val(arrid[index]);
                                $("#txtModuleType").val($(this).text());

                                $("#searchresult").css("display", "none");
                            });


                        } else {
                            bmflag = 0;
                            $("#searchresult").empty();
                            $("#searchresult").css("display", "none");

                        }
                    }
                });
            }
        });
    });
    //设置查询结果div坐标    

    function ChangeCoords() {
        //    var left = $("#txt_search")[0].offsetLeft; //获取距离最左端的距离，像素，整型    
        //    var top = $("#txt_search")[0].offsetTop + 26; //获取距离最顶端的距离，像素，整型（20为搜索输入框的高度）    
        var left = $("#txtModuleType").position().left; //获取距离最左端的距离，像素，整型    
        var top = $("#txtModuleType").position().top + 36;; //获取距离最顶端的距离，像素，整型（20为搜索输入框的高度）   
        var width = $("#txtModuleType").width() + 25;
        $("#searchresult").css("left", left + "px"); //重新定义CSS属性    
        $("#searchresult").css("top", top + "px"); //同上
        $("#searchresult").css("width", width + "px"); //同上


    }
    //指标模糊查询
    $(function () {

        $("#txtModuleTypezhibiao").keyup(function (evt) {
            var arrid = [];
            console.log(arrid);
            ChangeCoords(); //控制查询结果div坐标    
            var k = window.event ? evt.keyCode : evt.which;
            //输入框的id为txt_search，这里监听输入框的keyup事件    
            //不为空 && 不为上箭头或下箭头或回车    
            var json = { "json": [$("#txtModuleTypezhibiao").val(), ""] };
            var __str = JSON.stringify(json);

            zbflag = 0;
            if ($("#txtModuleTypezhibiao").val() != "" && k != 38 && k != 40 && k != 13) {

                $.ajax({
                    type: 'POST',
                    async: true, //同步执行，不然会有问题    
                    dataType: "Json",
                    url: "/BAPI/BAPI_ASHX.ashx",   //提交的页面/方法名    
                    data: { "api": "MC.YMJYGL.Server.YMJYGL.common.Select.BAPI_模糊查询_指标名称", "type": "json", "ticket": pub.State.Ticket, "data": __str },

                    error: function (msg) {//请求失败处理函数    
                        alert("数据加载失败");
                    },
                    success: function (data) { //请求成功后处理函数。    
                        /*  var objData = eval("(" + data.userName + ")");   */
                        console.log(data);
                        console.log(data.json.Data.dtList)

                        if (data.json.Data.dtList.length > 0) {
                            
                            layer = "<table id='worktb1'>";
                            $.each(data.json.Data.dtList, function (idx, item) {
                                console.log(item);
                                var id = item.指标ID;
                                arrid.push(id);

                                layer += "<tr class='line1'><td class='std1'>" + item.名称 + "</td></tr>";

                            });
                            layer += "</table>";

                            //将结果添加到div中        
                            $("#searchresult1").empty();
                            $("#searchresult1").append(layer);
                            $(".line1:first").addClass("hover1");
                            $("#searchresult1").css("display", "");
                            //鼠标移动事件    


                            $(".line1").hover(function () {
                                zbflag = 1;
                                $(".line1").removeClass("hover1");
                                $(this).addClass("hover1");
                                var width = $("#txtModuleTypezhibiao").width() + 25;
                                $(".hover1").css("width", width + "px");
                                $(".std1").css("width", width + "px");

                                var index = $(this).index();
                                console.log(index);
                                console.log(arrid[index]);
                                $('input[name="指标ID"]').val(arrid[index]);
                                $("#txtModuleTypezhibiao").val($(this).text());
                            }, function () {
                                $(this).removeClass("hover");
                                //$("#searchresult").css("display", "none");    
                            });
                            //鼠标点击事件    
                            $(".line1").click(function () {
                                zbflag =1;
                                var index = $(this).index();
                                console.log(index);
                                console.log(arrid[index]);
                                $('input[name="指标ID"]').val(arrid[index]);
                                $("#txtModuleTypezhibiao").val($(this).text());

                                $("#searchresult1").css("display", "none");
                            });


                        } else {
                            zbflag = 0;
                            $("#searchresult1").empty();
                            $("#searchresult1").css("display", "none");

                        }
                    }
                });
            }
        });
    });
    //设置查询结果div坐标    

    function ChangeCoords() {
        //    var left = $("#txt_search")[0].offsetLeft; //获取距离最左端的距离，像素，整型    
        //    var top = $("#txt_search")[0].offsetTop + 26; //获取距离最顶端的距离，像素，整型（20为搜索输入框的高度）    
        var left = $("#txtModuleTypezhibiao").position().left; //获取距离最左端的距离，像素，整型    
        var top = $("#txtModuleTypezhibiao").position().top + 36;; //获取距离最顶端的距离，像素，整型（20为搜索输入框的高度）   
        var width = $("#txtModuleTypezhibiao").width() + 25;
        $("#searchresult1").css("left", left + "px"); //重新定义CSS属性    
        $("#searchresult1").css("top", top + "px"); //同上
        $("#searchresult1").css("width", width + "px"); //同上


    }
    //////////////////////////////////////////
    //下拉列表绑定
    function BindSelector(selector, api) {
        // C M D
        var json = { "json": ['', 'R'] };
        var __str = JSON.stringify(json);
        $.ajax({
            type: "POST",
            url: "/BAPI/BAPI_ASHX.ashx",
            data: { "api": api, "type": "json", "ticket": pub.State.Ticket, "data": __str },
            dataType: "Json",
            error: function (xhr, status, error) {
                alert(error);
            },
            success: function (data) {

                if (data.json.State == "1") {
                    //console.log(data.json.Data.dt)
                    //填充列表
                    $.each(data.json.Data.dt, function (i, item) {

                        $(selector).append("<option value='" + item.ID + "'>" + item["名称"] + "</option>");

                    });

                } else {


                }
            }

        });
    }


    $('input').attr("readonly", "readonly");
    $('button').attr("disabled", "disabled");




    if (localStorage.FormMode == "Search") {
        //  alert(localStorage.BillId);
        $('input').removeAttr("readonly");
        $('input').removeAttr("disabled");
        $('select').removeAttr("disabled");
        $('button').removeAttr("disabled");
        $('select').removeAttr("disabled");
        $('#btntable-delete').attr("disabled", "disabled");
        $('#btntable-save').attr("disabled", "disabled");
        $('#btntable-edit').attr("disabled", "disabled");
        $('#btntable-go').attr("disabled", "disabled");
        $('#btntable-back').attr("disabled", "disabled");
       
        isDisabled = true; //禁用输入器
        if (localStorage.ydjhtbdata != undefined) {
            $("#frmdata").fill(JSON.parse(localStorage.ydjhtbdata), { styleElementName: 'none' });
        }
        //$(".input-group-addon").css('display', 'none');
        //$(".input-group-addon").css('visibility', 'visible');//输入器 
    }


});