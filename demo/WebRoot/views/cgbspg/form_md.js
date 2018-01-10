$(document).ready(function() {


   // alert('form_med');
    //---------------------------
    var isDisabled = true; //禁用
    //----------------
    //修改验证提示信息
    (function($) {
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
    $(".input-group-addon").off("click").on("click", function() {
        if (isDisabled) {
            return;
        }
        var $this = $(this);
        var metaid = $(this).data("metadata-id");
        var iscancel = false;
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
            cancel: function(index, layero) {
                //alert("cancel");
                localStorage.refname = "";
                iscancel = true;
                top.window.layer.close(index);
                return false;
            },
            close: function(index) {
               
                return false;
            },
            end: function() {
               
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
    ////////////////////////////////////////////

    //----------部门模糊查询start--------------------
    var flag = 0;
    var flagg = "";
    $(function () {

        $("#txtModuleType").keyup(function (evt) {
            var arrid = [];
            console.log(arrid);
            ChangeCoords1(); //控制查询结果div坐标    
            var k = window.event ? evt.keyCode : evt.which;
            //输入框的id为txt_search，这里监听输入框的keyup事件    
            //不为空 && 不为上箭头或下箭头或回车    
            var json = { "json": [$("#txtModuleType").val(), ""] };
            var __str = JSON.stringify(json);

           
            if ($("#txtModuleType").val() == "") {
                
                flag = 1;
                return;
            }

            if ($("#txtModuleType").val() != "" && k != 38 && k != 40 && k != 13) {
             
               
                $('input[name="部门ID"]').val('');
                flag = 0;
                localStorage.bumenid = 0;
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
                          //  flag = 1;
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
                                localStorage.Arry = '';
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
                                flag = 1;
                            }, function () {
                                $(this).removeClass("hover");
                                //$("#searchresult").css("display", "none");    
                            });
                            //鼠标点击事件    
                            $(".line").click(function () {
                                localStorage.Arry = '';
                                var index = $(this).index();
                                console.log(index);
                                console.log(arrid[index]);
                                $('input[name="部门ID"]').val(arrid[index]);
                                $("#txtModuleType").val($(this).text());

                                $("#searchresult").css("display", "none");

                                flag = 1;
                            });


                        } else {
                          
                           // flag = 0;
                        
                            $("#searchresult").empty();
                            $("#searchresult").css("display", "none");

                        }
                    }
                });
            }
          
            else if (k == 38) {//上箭头    
                $('#worktb tr.hover').prev().addClass("hover");
                $('#worktb tr.hover').next().removeClass("hover");
                var index = $('#worktb tr.hover').index();
                console.log(arrid[index]);
                $('input[name="部门ID"]').val(arrid[index]);
                $('#txtModuleType').val($('#worktb tr.hover').text());
                flag = 1;
            } else if (k == 40) {//下箭头    
                $('#worktb tr.hover').next().addClass("hover");
                $('#worktb tr.hover').prev().removeClass("hover");
                var index = $('#worktb tr.hover').index();
                console.log(localStorage.Arry);
                $('input[name="部门ID"]').val(arrid[index]);
                $('#txtModuleType').val($('#worktb tr.hover').text());
                flag = 1;
            }
            else if (k == 13) {//回车   
                localStorage.Arry = '';
                var index = $('#worktb tr.hover').index();
                console.log(arrid[index]);
                $('#txtModuleType').val($('#worktb tr.hover').text());
                $('input[name="部门ID"]').val(arrid[index]);
                $("#searchresult").empty();
                $("#searchresult").css("display", "none");
                flag = 1;
            }
            else {
                $("#searchresult").empty();
                $("#searchresult").css("display", "none");
                flag = 1;
            }
        });
        $("#searchresult").on("mouseleave", function () {
            $("#searchresult").empty();
            $("#searchresult").css("display", "none");
        });
    });
    //设置查询结果div坐标    

    function ChangeCoords1() {
        //    var left = $("#txt_search")[0].offsetLeft; //获取距离最左端的距离，像素，整型    
        //    var top = $("#txt_search")[0].offsetTop + 26; //获取距离最顶端的距离，像素，整型（20为搜索输入框的高度）    
        var left = $("#txtModuleType").position().left+16; //获取距离最左端的距离，像素，整型    
        var top = $("#txtModuleType").position().top+35; //获取距离最顶端的距离，像素，整型（20为搜索输入框的高度）   
        var width = $("#txtModuleType").width() + 25;
        $("#searchresult").css("left", left + "px"); //重新定义CSS属性    
        $("#searchresult").css("top", top + "px"); //同上
        $("#searchresult").css("width", width + "px"); //同上


    }
    //----------部门模糊查询end--------------------
    var API = "";
    if (localStorage.FormMode == "Add") {
        API = "MC.YMJYGL.Server.YMJYGL.common.Select.BAPI_模糊查询_指标名称计划填报";
    } else {
        API = "MC.YMJYGL.Server.YMJYGL.common.Select.BAPI_模糊查询_指标名称";
    }

    //-------指标模糊查询start--------//
    var flagzhibiao = 0;
    $(function () {

        $("#txtzbmc").keyup(function (evt) {
            var arrid = [];
            console.log(arrid);
            ChangeCoords(); //控制查询结果div坐标    
            var k = window.event ? evt.keyCode : evt.which;
            //输入框的id为txt_search，这里监听输入框的keyup事件    
            //不为空 && 不为上箭头或下箭头或回车    
            var json = { "json": [$("#txtzbmc").val(), ""] };
            var __str = JSON.stringify(json);
            
            if ($("#txtzbmc").val() == "") {
                flagzhibiao = 1;
                return;
            }
        

            if ($("#txtzbmc").val() != "" && k != 38 && k != 40 && k != 13) {
              
                $('input[name="指标ID"]').val('');
                flagzhibiao = 0;
                localStorage.zhibiaoid = 0;
                $.ajax({
                    type: 'POST',
                    async: true, //同步执行，不然会有问题    
                    dataType: "Json",
                    url: "/BAPI/BAPI_ASHX.ashx",   //提交的页面/方法名    
                    data: { "api": API, "type": "json", "ticket": pub.State.Ticket, "data": __str },

                    error: function (msg) {//请求失败处理函数    
                        alert("数据加载失败");
                    },
                    success: function (data) { //请求成功后处理函数。    
                        /*  var objData = eval("(" + data.userName + ")");   */
                        console.log(data);
                        console.log(data.json.Data.dtList)

                        if (data.json.Data.dtList.length > 0) {
                          //  flagzhibiao = 1;
                            layer = "<table id='worktb'>";
                            $.each(data.json.Data.dtList, function (idx, item) {
                                console.log(item);
                                var id = item.指标ID;
                                arrid.push(id);

                                layer += "<tr class='line'><td class='std'>" + item.名称 + "</td></tr>";

                            });
                            layer += "</table>";

                            //将结果添加到div中        
                            $("#searchresult1").empty();
                            $("#searchresult1").append(layer);
                            $(".line:first").addClass("hover");
                            $("#searchresult1").css("display", "");
                            //鼠标移动事件    


                            $(".line").hover(function () {
                                localStorage.Arry = '';
                                $(".line").removeClass("hover");
                                $(this).addClass("hover");
                                var width = $("#txtzbmc").width() + 25;
                                $(".hover").css("width", width + "px");
                                $(".std").css("width", width + "px");

                                var index = $(this).index();
                                console.log(index);
                                console.log(arrid[index]);
                                $('input[name="指标ID"]').val(arrid[index]);
                                $("#txtzbmc").val($(this).text());

                                flagzhibiao = 1;
                            }, function () {
                                $(this).removeClass("hover");
                                //$("#searchresult").css("display", "none");    
                            });
                            //鼠标点击事件    
                            $(".line").click(function () {
                                localStorage.Arry = '';
                                var index = $(this).index();
                                console.log(index);
                                console.log(arrid[index]);
                                $('input[name="指标ID"]').val(arrid[index]);
                                $("#txtzbmc").val($(this).text());

                                $("#searchresult1").css("display", "none");
                                flagzhibiao = 1;
                            });


                        } else {
                         
                               
                         
                            $("#searchresult1").empty();
                            $("#searchresult1").css("display", "none");

                        }
                    }
                });
            }
            else if (k == 38) {//上箭头    
                $('#worktb tr.hover').prev().addClass("hover");
                $('#worktb tr.hover').next().removeClass("hover");
                var index = $('#worktb tr.hover').index();
                console.log(arrid[index]);
                $('input[name="指标ID"]').val(arrid[index]);
                $('#txtzbmc').val($('#worktb tr.hover').text());
                flagzhibiao = 1;
            } else if (k == 40) {//下箭头    
                $('#worktb tr.hover').next().addClass("hover");
                $('#worktb tr.hover').prev().removeClass("hover");
                var index = $('#worktb tr.hover').index();
                console.log(localStorage.Arry);
                $('input[name="指标ID"]').val(arrid[index]);
                $('#txtzbmc').val($('#worktb tr.hover').text());
                flagzhibiao = 1;
            }
            else if (k == 13) {//回车   
                localStorage.Arry = '';
                var index = $('#worktb tr.hover').index();
                console.log(arrid[index]);
                $('#txtzbmc').val($('#worktb tr.hover').text());
                $('input[name="指标ID"]').val(arrid[index]);
                $("#searchresult1").empty();
                $("#searchresult1").css("display", "none");
                flagzhibiao = 1;
            }
            else {
                $("#searchresult1").empty();
                $("#searchresult1").css("display", "none");
            }
        });
        $("#searchresult1").on("mouseleave", function () {
            $("#searchresult1").empty();
            $("#searchresult1").css("display", "none");
        });
    });
    //设置查询结果div坐标    

    function ChangeCoords() {
        //    var left = $("#txt_search")[0].offsetLeft; //获取距离最左端的距离，像素，整型    
        //    var top = $("#txt_search")[0].offsetTop + 26; //获取距离最顶端的距离，像素，整型（20为搜索输入框的高度）    
        var left = $("#txtzbmc").position().left + 16; //获取距离最左端的距离，像素，整型    
        var top = $("#txtzbmc").position().top + 36;; //获取距离最顶端的距离，像素，整型（20为搜索输入框的高度）   
        var width = $("#txtzbmc").width() + 25;
        $("#searchresult1").css("left", left + "px"); //重新定义CSS属性    
        $("#searchresult1").css("top", top + "px"); //同上
        $("#searchresult1").css("width", width + "px"); //同上


    }

    //--------指标查询end----//





    //-------------------------
    var isNew = false;
    //----------delete--------------------
    $("#btntable-delete").off("click").on("click", function() {
       
        // 判断是否下达


        var __str = { "json": [{ "单据年": $("#form_year").val(), "单据月": $("#form_month").val(), "部门ID": $("#bumen_id").val(), "指标ID": $("#zhibiao_id").val() }] };
        var __str = JSON.stringify(__str);
        $.ajax({
            type: "POST",
            url: "/BAPI/BAPI_ASHX.ashx",
            data: { "api": "MC.YMJYGL.Server.YMJYGL.common.Select.BAPI_验证_单据是否下达", "type": "json", "ticket": pub.State.Ticket, "data": __str },
            dataType: "json",
            error: function (xhr, status, error) {
                alert(error);
            },
            success: function (data) {
                //   console.log(data.json.Data);
                if (data.json.State == "0") {

                    top.window.layer.msg(data.json.Message);
                    return;
                } else {
                    if (data.json.State == "1") {

                        ///////////////////////////////////
                        var json = { "json": [localStorage.BillId, 'D', localStorage.mid] };
                        var __str = JSON.stringify(json);
                        $.ajax({
                            type: "POST",
                            url: "/BAPI/BAPI_ASHX.ashx",
                            data: { "api": "MC.YMJYGL.Server.YMJYGL.common.OperateDb.BAPI_单表JSON处理", "type": "json", "ticket": pub.State.Ticket, "data": __str },
                            dataType: "json",
                            error: function (xhr, status, error) {
                                alert(error);
                            },
                            success: function (data) {
                                //   console.log(data.json.Data);
                                if (data.json.State == "1") {

                                    top.window.layer.msg("删除成功");
                                    top.window.layer.close(localStorage.layerindex);

                                } else {
                                    if (data.json.Message != "") {
                                        //后台提示
                                        top.window.layer.msg(data.json.Message);
                                    } else {
                                        top.window.layer.msg("删除失败");
                                    }
                                    // top.window.layer.msg("操作失败");
                                }
                            }
                        });
                    }
                }
            }
        });


          
        //如何关闭
    });

    //----------search----------//
    $('#btntable-search').off("click").on("click", function () {


    
        if ($('#form_year').val() == "0" && $('#form_month').val() == "0" ) {
            top.window.layer.msg("请选年和月");
            return;
        }

        if ($("#txtModuleType").val() != "") {
            console.log(localStorage.bumenid);
            if (localStorage.bumenid == 0) {
                if (flag == 0) {
                    top.window.layer.msg('选择的部门不存在');
                    return;
                };
            }
        }
        else {
            $('input[name="部门ID"]').val('');
        }
        if ($("#txtzbmc").val() != "") {
            console.log(localStorage.zhibiaoid);
            if (localStorage.zhibiaoid == 0) {
                if (flagzhibiao == 0) {
                    top.window.layer.msg('选择的指标不存在');
                    return;
                };
            }
        }
        else {
            $('input[name="指标ID"]').val('');
        }


    

        $('#btntable-save').removeAttr("disabled", "disabled");
        var data = $("#frmdata").serializeObject();  //获取form 所有数据转换json数据
       FormAction(data, "R", localStorage.mid);
    });

    //---form_search_list search---//
    $('#btntable_search_list').off("click").on("click", function () {
        if ($('#form_year').val() == "0" || $('#form_month').val() == "0") {
            top.window.layer.msg("请选选择年和月");
            return;
        }
        //  console.log($('#txtModuleType').val());
        if ($("#txtModuleType").val() != "") {
            console.log(localStorage.bumenid);
            if (localStorage.bumenid ==0) {
                if (flag == 0) {
                    top.window.layer.msg('选择的部门不存在');
                    return;
                };
            }
        }
        else {
            $('input[name="部门ID"]').val('');
        }
        if ($("#txtzbmc").val() != "")
        {
            console.log(localStorage.zhibiaoid);
            if (localStorage.zhibiaoid ==0) {
                if (flagzhibiao == 0) {
                    top.window.layer.msg('选择的指标不存在');
                    return;
                };
            }
        }
        else
        {
            $('input[name="指标ID"]').val('');
        }
     
        var data = $("#frmdata").serializeObject();  //获取form 所有数据转换json数据 
        data['调整历史'] = '';
        delete data['计量单位'];
        delete data['是否查询部门下级'];
          
        localStorage.chaxu = JSON.stringify(data);   
       var json = JSON.stringify(data);
       json = json.replace(/\"/g, "'");
       localStorage.ListQueryJsoncha = json;    
       top.window.layer.close(localStorage.layerindex);
    });

    
   
    
    //----------save--------------------
    $("#btntable-save").off("click").on("click", function () {
     

        if (localStorage.FormMode == "Edit") {
        
     

            // 判断是否下达
           
           
            var __str = { "json": [{ "单据年": $("#form_year").val(), "单据月": $("#form_month").val(), "部门ID": $("#bumen_id").val(), "指标ID": $("#zhibiao_id").val() }] };
            var __str = JSON.stringify(__str);
            $.ajax({
                type: "POST",
                url: "/BAPI/BAPI_ASHX.ashx",
                data: { "api": "MC.YMJYGL.Server.YMJYGL.common.Select.BAPI_验证_单据是否下达", "type": "json", "ticket": pub.State.Ticket, "data": __str },
                dataType: "json",
                error: function (xhr, status, error) {
                    alert(error);
                },
                success: function (data) {
                    //   console.log(data.json.Data);
                    if (data.json.State == "0") {
                       
                        top.window.layer.msg(data.json.Message);
                        return;
                    } else {
                        if (data.json.State == "1") {

                         
                            var data1 = $("#frmdata").serializeObject(); //自动将form表单封装成json ,name属性
                            data1.table = $("#frmdata").data("table");
                            delete data1['本月计划'];
                            delete data1['是否查询部门下级'];

                            var dzjg;
                            var dzyy;
                            if ($('#调整结果').val() == "") {
                                dzjg = '空';
                            }
                            else {
                                dzjg = $('#调整结果').val();
                            }
                            if ($('#调整原因').val() == "") {
                                dzyy = '空';
                            }
                            else {
                                dzyy = $('#调整原因').val();
                            }
                            var dzjs = "调整时间:" + getNowFormatDate() + "调整结果:" + dzjg + "调整原因:" + dzyy;
                            data1['调整历史'] = dzjs + " | " + $('#调整历史').val();
                            // alert(JSON.stringify(data));
                            // var str = JSON.stringify(jjson);
                            FormAction1(data1, "M", localStorage.mid);
                        }
                    }
                }
            });


            
        }
        else
        {
            var jjson = {};

            jjson.table = $("#frmdata").data("table");
            jjson.单据类型 = '月度调整';
            jjson.datas = [];
            jjson.delfields = [];
            var grid = mc_grid_dic['grid_2'];
            jjson.datas = grid.getData().getItems();
            if (jjson.datas == "") {

                top.window.layer.msg("没有数据保存");
                return;
            }
            var jjson_json = [];
            var falg = 0;
           // var jjson_json_json = [];
            for (i = 0; i < jjson.datas.length; i++) {
                
                if (jjson.datas.length == 1) {
                    if (jjson.datas[i].调整量 != undefined || jjson.datas[i].调整结果 != undefined) {

                        if (jjson.datas[i].调整原因 == undefined) {
                            jjson.datas[i].调整原因 = '';

                        }
                      
                        jjson_json.push(jjson.datas[i]);
                    }
                    else {

                        top.window.layer.msg("没有创建数据");
                        return;
                    }
                }
                else {            
                    if (jjson.datas[i].调整量 != undefined || jjson.datas[i].调整结果 != undefined)
                    {
                        if (jjson.datas[i].调整原因 == undefined) {
                            jjson.datas[i].调整原因 = '';
                        }
                        //if (jjson.datas[i]. == undefined) {
                        //    jjson.datas[i].调整原因 = '0';
                        //}
                        jjson_json.push(jjson.datas[i]);                        
                    }
                    else {

                        ++falg;
                        
                    }
                }
                
            }
            if (falg == jjson.datas.length) {
                top.window.layer.msg("没有创建数据");
                return;
            }
            jjson.datas = jjson_json;    
            jjson.delfields = ['本月自报', '本月计划'];
           //alert(JSON.stringify(jjson));
           FormAction2(jjson, "C", localStorage.mid);
        }
      

    });
    /////系统获取当前时间
    function getNowFormatDate() {
        var date = new Date();
        var seperator1 = "-";
        var seperator2 = ":";
        var month = date.getMonth() + 1;
        var strDate = date.getDate();
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
        }
        var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
                + " " + date.getHours() + seperator2 + date.getMinutes()
                + seperator2 + date.getSeconds();
        return currentdate;
    }



    /////////////////
    function FormAction2(data, action, mid) {

        //R C M D    R  ready   c   create  m   xiuggai  d delete
        var json = { "json": [data, action, mid] };
        var __str = JSON.stringify(json);
      //  alert(__str);
         //return;
        $.ajax({
            type: "POST",
            url: "/BAPI/BAPI_ASHX.ashx",
            data: { "api": "MC.YMJYGL.Server.YMJYGL.business.Plan.BAPI_月度调整JSON处理", "type": "json", "ticket": pub.State.Ticket, "data": __str },
            dataType: "json",
            error: function (xhr, status, error) {
                alert(error);
            },
            success: function (data) {
                //   console.log(data.json.Data);
                if (data.json.State == "1") {                 
                    if (action == "R") {
                        console.log(data.json.Data.dt[0]);
                        $("#frmdata").fill(data.json.Data.dt[0], { styleElementName: 'none' });
                    }
                    if(action=='C' || action=='M')
                    {
                        top.window.layer.msg("操作成功");
                    }                  
                } else {
                    if (data.json.Message != "") {
                        //后台提示
                        top.window.layer.msg(data.json.Message);
                    } else {
                        top.window.layer.msg("操作失败");
                    }                   
                }
            }
        });
    }


    ///////////////////////////
    function FormAction1(data, action, mid) {

        //R C M D    R  ready   c   create  m   xiuggai  d delete
        var json = { "json": [data, action, mid] };
        var __str = JSON.stringify(json);
    // alert(__str);
        
        $.ajax({
            type: "POST",
            url: "/BAPI/BAPI_ASHX.ashx",
            data: { "api": "MC.YMJYGL.Server.YMJYGL.common.OperateDb.BAPI_单表JSON处理", "type": "json", "ticket": pub.State.Ticket, "data": __str },
            dataType: "json",
            error: function (xhr, status, error) {
                alert(error);
            },
            success: function (data) {

                //   console.log(data.json.Data);
                if (data.json.State == "1") {
                 //   alert('1');

                    if (action == "R") {
                        console.log(data.json.Data.dt[0]);
                     
                        //error?
                        $("#frmdata").fill(data.json.Data.dt[0], { styleElementName: 'none' });


                    }
                    if (action == 'C' || action == 'M') {
                        top.window.layer.msg("操作成功");
                    }            
                } else {
                    if (data.json.Message != "") {
                        //后台提示
                        top.window.layer.msg(data.json.Message);
                    } else {
                        top.window.layer.msg("操作失败");
                    }
                    // top.window.layer.msg("操作失败");
                }
            }
        });
    }

    //----------add--------------------
    $("#btntable-chongzhi").off("click").on("click", function() {
        //重置表单
   
        $('#frmdata')[0].reset();

        flagg = 1;

    });

   
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
            error: function(xhr, status, error) {
                alert(error);
            },
            success: function(data) {

                if (data.json.State == "1") {
                    //console.log(data.json.Data.dt)
                    //填充列表
                    $.each(data.json.Data.dt, function(i, item) {

                        $(selector).append("<option value='" + item.ID + "'>" + item["名称"] + "</option>");

                    });

                } else {


                }
            }

        });
    }
    //-----------窗体增删改查事件--------------------
    function FormAction(data, action, mid) {
     
        //R C M D    R  ready   c   create  m   xiuggai  d delete
        var json = { "json": [data, action, mid] };
        var __str = JSON.stringify(json);
     //alert(__str);
        $.ajax({
            type: "POST",
            url: "/BAPI/BAPI_ASHX.ashx",
            data: { "api": "MC.YMJYGL.Server.YMJYGL.common.OperateDb.BAPI_数据初始化", "type": "json", "ticket": pub.State.Ticket, "data": __str },
            dataType: "json",
            error: function(xhr, status, error) {
                alert(error);
            },
            success: function (data) {
              
               console.log(data.json.Data);
                if (data.json.State == "1") {
                    if (action == "R") {

                        localStorage.search_array = JSON.stringify(data.json.Data);
                        var json = JSON.stringify(localStorage.search_array);//获取本地数据搜过的数据
                        var json1 = JSON.parse(json).replace("\"dt\":", "");//进行json转换
                        var json3 = json1.substring(1, json1.length - 1);//截取字符串
                        var data1 = [];
                        data1 = JSON.parse(json3);//重新让字符串变成json                 
                        var gridid = $(".detail-table").attr("id");
                        //console.log(gridid);
                        var grid = mc_grid_dic[gridid];
                      //  console.log(data1);
                        var dataview = grid.getData();
                        dataview.setItems(data1);
                        if (data1.length===0) {
                            top.window.layer.msg("没有数据");
                            return;
                        }
 
                    }
                    if (action == "C") {
                    
                        localStorage.search_array = JSON.stringify(data.json.Data);
                            var json = JSON.stringify(localStorage.search_array);//获取本地数据搜过的数据
                            var json1 = JSON.parse(json).replace("\"dt\":", "");//进行json转换
                            var json3 = json1.substring(1, json1.length - 1);//截取字符串
                            var data1 = [];
                            data1 = JSON.parse(json3);//重新让字符串变成json                       
                            var gridid = $(".detail-table").attr("id");
                            //console.log(gridid);
                            var grid = mc_grid_dic[gridid];
                           // console.log(grid);
                            var dataview = grid.getData();                        
                            dataview.setItems(data1);
                           // alert();
                          //  alert(data1.length);
                    }
                    else if (action == "D") {
                        //删除关闭
                      //  console.log(data.json.Data);
                       // alert('afaf');
                       top.window.layer.close(localStorage.layerindex);

                    } else {
                       // top.window.layer.msg("操作成功");
                    }
                } else {
                    if (data.json.Message != "") {
                        //后台提示
                        top.window.layer.msg(data.json.Message);
                    } else {
                        top.window.layer.msg("操作失败");
                    }
                    // top.window.layer.msg("操作失败");
                }
            }
        });
    }
  
    
  
    if (localStorage.FormMode == "View") {
        //alert('123132');
        $('input').attr("disabled", "disabled"); //checkbox
        $('button').attr("disabled", "disabled");
        $('select').attr("disabled", "disabled");
        $('textarea').attr('disabled', 'disabled');
        $('#form-group').css('display', 'block');
        $('#form-group1').css('display', 'block');
        $('#form-group2').css('display', 'block');
        $('#form-group3').css('display', 'block');
        $('#btntable_search_list').css('display', 'none');
        FormAction1(localStorage.BillId, "R", localStorage.mid);
    
        isDisabled = true; //禁用输入器 
    }
    if (localStorage.FormMode == "Add") {
     
    
        $('#btntable-go').removeAttr('disabled');
        $('#btntable-back').removeAttr('disabled');
        $('#myTab').removeAttr('hidden', 'hidden');
        $('#form-group').css('display', 'block');
        $('#myTabContent').removeAttr("hidden", "hidden");//子表隐藏
        $('#myTab').css('margin-top', '-30px');
        $('#btntable_search_list').css('display', 'none');
        $('#txtModuleType').removeAttr('readonly');
        $('#txtzbmc').removeAttr('readonly');
        isDisabled = false; //禁用输入器

    }
    if (localStorage.FormMode == "Edit") {

       // alert('121');
        $('input').removeAttr("readonly");
        $('input').removeAttr("disabled");
        $('select').removeAttr("disabled");
        $('button').removeAttr("disabled");
        $('#form-group').css('display', 'block');
        $('#form-group1').css('display', 'block');
        $('#form-group2').css('display', 'block');
        $('#form-group3').css('display', 'block');
        $('#btntable_search_list').css('display', 'none');
        $('#btntable-search').css('display', 'none');
        $('#btntable-chongzhi').css('display', 'none');
        $('#txtModuleType').attr('disabled', 'disabled');
        $('#txtzbmc').attr('disabled', 'disabled');
        $('#form_month').attr('disabled', 'disabled');
        $('#form_year').attr('disabled', 'disabled');
        $('#input_group_btn_bumen_s').attr('disabled', 'disabled');
        $('#txtzhibiao').attr('disabled', 'disabled');
        $('#form_jiliang').attr('disabled', 'disabled');
        $('#本月计划').attr('disabled', 'disabled');
        $('#调整历史').attr('disabled', 'disabled');
        isDisabled = false; //禁用输入器
        FormAction1(localStorage.BillId, "R", localStorage.mid);     
    }
    if (localStorage.FormMode == "Delete") {
        //  alert(localStorage.BillId);
        $('input').attr("disabled", "disabled"); //checkbox
        $('button').attr("disabled", "disabled");
        $('select').attr("disabled", "disabled");
        $('#btndelete').removeAttr("disabled");
        $('#form-group').css('display', 'block');
        $('#form-group1').css('display', 'block');
        $('#form-group2').css('display', 'block');
        $('#form-group3').css('display', 'block');
        $('#btntable-delete').css('display', 'block');
        $('#btntable-delete').removeAttr("disabled", "disabled");
        FormAction1(localStorage.BillId, "R", localStorage.mid);
        
        isDisabled = true; //禁用输入器
       
    }
    if (localStorage.FormMode == 'Search')
    {
       
      
        $('#form-group').css('display', 'block');
        $("#btntable-search").css('display', 'none');
        $("#btntable_search_list").css('display', 'block');
        $('#form-group1').attr('hidden', 'hidden');
        $('#form-group2').attr('hidden', 'hidden');
        $('#form-group3').attr('hidden', 'hidden');
        $('#txtModuleType').removeAttr('readonly');
        $('#txtzbmc').removeAttr('readonly');
        $('.form_form').css('height','400px');
     
        $('#myTabContent').attr('hidden', 'hidden');
        $('#btntable-save').css('display', 'none');
        $('#myTab').attr('hidden', 'hidden');
        //alert('search');
        if (localStorage.chaxu !=  undefined) {        
            // console.log(JSON.parse(localStorage.chaxu));   
            flagzhibiao = 1;
            flag = 1;
            $("#frmdata").fill(JSON.parse(localStorage.chaxu), { styleElementName: 'none' });
        }
     
      
        isDisabled = true; //禁用输入器
    }
  

    //WF----工作流提交-----------
    $("#btntable-go").off("click").on("click", function() {

        var billid = $('input[name="ID"]').val();
        var mid = localStorage.mid;
        wfAction(mid, billid);
    });
    //WF----工作流退回（一退到底）-----------
    $("#btntable-back").off("click").on("click", function() {

        var billid = $('input[name="ID"]').val();
        var mid = localStorage.mid;
        wfBackAction(mid, billid);
    });

    //WF----工作流后台服务，工作流集成-----------
    function wfAction(mid, billid) {
        var json = { "json": [mid, billid] };
        var __str = JSON.stringify(json);
        $.ajax({
            type: "POST",
            url: "/BAPI/BAPI_ASHX.ashx",
            data: { "api": "MC.Server.Module.WFManager.BAPI_工作流_提交", "type": "json", "ticket": pub.State.Ticket, "data": __str },
            dataType: "Json",
            error: function(xhr, status, error) {
                alert(error);
            },
            success: function(data) {
                //console.log(data.json);
                if (data.json.State == "1") {
                    top.window.layer.msg("操作成功");

                } else {
                    if (data.json.Message != "") {
                        //后台提示
                        top.window.layer.msg(data.json.Message);
                    } else {
                        top.window.layer.msg("操作失败");
                    }


                }
            }

        });
    }

    //WF----工作流后台服务，工作流集成-----------
    function wfBackAction(mid, billid) {
        var json = { "json": [mid, billid] };
        var __str = JSON.stringify(json);
        $.ajax({
            type: "POST",
            url: "/BAPI/BAPI_ASHX.ashx",
            data: { "api": "MC.Server.Module.WFManager.BAPI_工作流_退回", "type": "json", "ticket": pub.State.Ticket, "data": __str },
            dataType: "Json",
            error: function(xhr, status, error) {
                alert(error);
            },
            success: function(data) {
                console.log(data.json);
                if (data.json.State == "1") {
                    top.window.layer.msg("操作成功");

                } else {
                    if (data.json.Message != "") {
                        //后台提示
                        top.window.layer.msg(data.json.Message);
                    } else {
                        top.window.layer.msg("操作失败");
                    }

                }
            }

        });
    }
    //---------------------
    
});