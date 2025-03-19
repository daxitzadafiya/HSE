!function(t){"use strict";
var SELECT_ALL_LIMIT = 25;

$.fn.select2.amd.define('select2/selectAllAdapter', [
  'select2/utils',
  'select2/dropdown',
  'select2/dropdown/attachBody'
], function(Utils, Dropdown, AttachBody) {
  function SelectAll() {}

  SelectAll.prototype.render = function(decorated) {
    var $rendered = decorated.call(this);
    var self = this;

    var $selectAll = $('<input type="checkbox" class="man xe" /><small id="lk"></small><br>');

    var checkOptionsCount = function() {
      var count = $('.select2-results__option').length;
      $selectAll.text('Velg alle (' + count + ')');
      $selectAll.prop('', count > SELECT_ALL_LIMIT);
    }


    var $container = $('.select2-container');
    $container.bind('keyup click', checkOptionsCount);

    var $dropdown = $rendered.find('.select2-dropdown')


    $dropdown.prepend($selectAll);

    $selectAll.on('click', function(e) {
        var $results = $rendered.find('.select2-results__option[aria-selected=false]');
        console.log($results);
        var _this = $(this);
        var _select = $(".select2-container--open").parents(".input-group").find(".res > option");
        if( e.target.checked == true){
        _select.prop("selected",true);// Select All Options
        _select.trigger("change");
        }else if(e.target.checked == false){
           _select.prop("selected",false);// Select All Options
           _select.trigger("change");
        }
     _this.trigger('close');
    });

    return $rendered;
  };

  return Utils.Decorate(
  	Utils.Decorate(
    	Dropdown,
      AttachBody
    ),
  	SelectAll
  );
});
}(window.jQuery);