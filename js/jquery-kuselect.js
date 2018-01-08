/* 
 统一select的选择接口 
 目的：方便调用,不用在每个页面上去写代码
 条件:select 带有 ku-select 其他的select 不会处理
 data-type="接口方法" 注意是唯一的
 使用方式 <select id="selParentID" ku-select data-type="GetAdminMenuList"  data-prompt="请选择" data-value="">
*/

layui.use(['form'], function () {
    var apiUrl = "aa.json";
    var $kuselect = $("select[ku-select]");
    if ($kuselect.length > 0) {
        $.each($kuselect, function (index, select) {
            //select
            if (select.hasAttribute("data-type")) {
                var type = select.getAttribute("data-type");
                var value = select.getAttribute("data-value");
                var prompt = select.getAttribute("data-prompt");
                if (type != "" && type != null) {
                    setTimeout(function () {
                        generateSelect($(select), type, value, prompt);
                    }, 3000);
                   
                }
            }
        })
    }
    function generateSelect(selectObj, type, value, prompt) {
        
        $.getJSON(apiUrl, { action: type, value: value }).done(function (result) {
            if (result.code == 1) {
                var data = result.data;
                var html = '';
                if (prompt != "") {
                    html += '<option value="" >' + prompt + '</option>;';
                }
                html += getSelectOptionHtml(data);
                selectObj.html(html);
                var form = layui.form;
                if (selectObj.attr("lay-ignore") == undefined && form != undefined) {
                    form.render('select');
                }
            }
        });
    }
    function getSelectOptionHtml(data) {
        var html = '';
        $.each(data || {}, function (index, item) {
            //有下级
            if (item.child != null) {
                html += '<optgroup label="' + item.Text + '">';
                $.each(item.child || [], function (ix, childItem) {
                    html += '<option value="' + childItem.Value + '" ' + (childItem.IsSelected == true ? "selected='selected'" : "") + '>' + childItem.Text + '</option>';
                })

                html += '</optgroup>';
            }
            else {
                html += '<option value="' + item.Value + '" ' + (item.IsSelected == true ? "selected='selected'" : "") + '>' + item.Text + '</option>';
            }
        })
        return html;

    }
})