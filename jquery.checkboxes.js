<!--
/*
 * (c) CCDN (c) CodeConsortium <http://www.codeconsortium.com/> 
 * 
 * Available on github <http://www.github.com/codeconsortium/>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 * Plugin jQuery.Checkboxes
 *
 * @author Reece Fowell <reece at codeconsortium dot com>
 *
 * Requires JQuery, make sure to have JQuery included in your JS to use this.
 * JQuery needs to be loaded before this script in order for it to work.
 */

$(document).ready(function() {
	$('[data-checkboxes]').checkboxes();
});

!function($) {

	/*
	 *
	 * CHECKBOXES PLUGIN DEFINITION
	 */
	$.fn.checkboxes = function () {
		var checkboxes = $([]);

		this.each(function() {
			var $this = $(this);
			
			checkboxes.push(new Checkboxes($this));
		});
	};

	/*
	 *
	 * CHECKBOXES PUBLIC CLASS DEFINITION
	 */
	function Checkboxes(element) {
		this.init(element);
	};
	
	Checkboxes.prototype.init = function (container) {
		this.table = $(container).find('table').eq(0);
				
		// Get Toolbars
		this.collapse = $(container).find('div.collapse');
		
		// Unhide the checkbox buttons/toolbars
		this.collapse.each(function(i, collapse) {
			$(collapse).removeClass('collapse');
		});
		
		// Stupid hack Part 1, because 'this' in a bound click event
		// refers to the button or whatever instead of this freaking class.
		var that = this;

		this.qualifiers = $([]);
		
		// Get Buttons.
		var buttons = $(container).find('button, input[type="submit"], a');
		this.buttons = $([]);
		
		// Bind button click event to all editor buttons.
		fnButtonClick = this.buttonClick;
		buttons.each(function(i, button) {
			$(button).bind('click', {editor: that}, fnButtonClick);
			that.buttons.push($(button));
			
			var qualifiers = $(button).data('responds');
			if (qualifiers && qualifiers.length > 0) {
				that.qualifiers = that.merge(that.qualifiers, qualifiers);
			}
		});

		// Get checkboxes.
		var checkboxes = $(this.table).find('input[type="checkbox"]');
		this.checkboxes = $([]);
		
		// Bind button click event to all editor buttons.
		fnCheckboxClick = this.checkboxClick;
		fnMasterCheckboxClick = this.masterCheckboxClick;
		checkboxes.each(function(i, checkbox) {
			var master = $(checkbox).data('master-checkbox');
			
			if (master) {
				$(checkbox).bind('click', {editor: that}, fnMasterCheckboxClick);
				that.master = checkbox;
			} else {
				$(checkbox).bind('click', {editor: that}, fnCheckboxClick);
				that.checkboxes.push($(checkbox));

				var qualifiers = $(checkbox).data('qualifiers');
				if (qualifiers && qualifiers.length > 0) {
					that.qualifiers = that.merge(that.qualifiers, qualifiers);
				}
			}
		});
		
		// Determine button enable/disable responses.
		that.buttonResponders();
	};
	
	Checkboxes.prototype.getQualifyingCheckboxes = function (qualifiers, requireChecked) {
		var checkboxes = [];
		var that = this;
		
		$(that.checkboxes).each(function(i1, checkbox) {
			qHas = checkbox.data('qualifiers');

			if (qHas) {
				var found = false;
				
				$(qualifiers).each(function(i2, qNeed) {
					if (found == true) {
						return;
					}
					
					if (($.inArray(qNeed, qHas) >= 0)) {
						found = true;

						if (requireChecked) {
							if (!$(checkbox).is(':checked')) {
								return;
							}	
						} 
						
						checkboxes.push($(checkbox));
					}
				});
			}
		});
		
		$.unique(checkboxes);

		return checkboxes;
	};
	
	Checkboxes.prototype.buttonClick = function (event) {
		var that = event.data.editor;
		var button = $(this);
		
		if (!$(button).data('qualifier')) {
			if (!$(button).data('select-none')) {
				return;
			} else {
				if ($(button).data('select-none')) {
					that.checkboxes.each(function(i, checkbox) {
						that.untick(checkbox);
					});

					// Determine button enable/disable responses.
					that.masterResponder();
					that.buttonResponders();
					
					return;
				}
			}
		}

		
		// Data-Qualifiers should be a valid JSON Array.
		var qualifier = button.data('qualifier');
		
		if (! $.isArray(qualifier)) {
			var qualifiers = [qualifier];
		} else {
			var qualifiers = qualifier;
		}

		var checkboxes = that.getQualifyingCheckboxes(qualifiers, false);
		
		$(checkboxes).each(function(i, checkbox) {
			that.tick(checkbox);
		});
		
		// Determine button enable/disable responses.
		that.masterResponder();
		that.buttonResponders();
	};
	
	Checkboxes.prototype.masterCheckboxClick = function (event) {
		var master = $(this);
		var that = event.data.editor;
		
		if ($(master).is(':checked')) {
			$(that.checkboxes).each(function(i, checkbox) {
				that.tick(checkbox);
			});
		} else {
			$(that.checkboxes).each(function(i, checkbox) {
				that.untick(checkbox);
			});
		}
		
		// Determine button enable/disable responses.
		that.buttonResponders();
	};
	
	Checkboxes.prototype.checkboxClick = function (event) {
		var checkbox = $(this);
		var that = event.data.editor;

		// Determine button enable/disable responses.
		that.masterResponder();
		that.buttonResponders();
	};
	
	Checkboxes.prototype.tick = function (checkbox) {
		$(checkbox).prop('checked', true);
	};
	
	Checkboxes.prototype.untick = function (checkbox) {
		$(checkbox).prop('checked', false);
	};
	
	Checkboxes.prototype.buttonResponders = function () {
		var that = this;
		$(this.buttons).each(function(i, button) {
			var responds = $(button).data('responds');
			
			if (!responds) {
				return;
			} else {
				if (responds.length > 0) {
					$.merge(responds, []);
				} else {
					$.merge(responds, that.qualifiers);
				}
			}
			
			var checkboxes = that.getQualifyingCheckboxes(responds, true);
			
			if (checkboxes.length > 0) {
				$(button).removeClass('disabled');
				$(button).prop('disabled', false);
			} else {
				$(button).addClass('disabled');
				$(button).prop('disabled', true);
			}
		});
	};
	
	Checkboxes.prototype.masterResponder = function () {
		// Determine if master checkbox remains checked.
		var checkCount = 0;
		this.checkboxes.each(function (i, check) {
			if ($(check).is(':checked')) {
				checkCount++;
			}
		});

		if (checkCount == this.checkboxes.length) {
			this.tick(this.master);
		} else {
			this.untick(this.master);
		}
	};
	
	Checkboxes.prototype.merge = function (a, b) {
		if (b.length > 0) {
			// For-each of the new array to be merged.
			for (index_b = 0; (index_b < b.length); index_b++) {
				var found = false;

				// Does the current index of B already exist within A?
				for (index_a = 0; (index_a < a.length); index_a++) {
					if (a[index_a] == b[index_b]) {
						found = true;
						
						break;
					}
				}
				
				if (found == false) {
					a.push(b[index_b]);
				}
			}
		}
		
		return a;
	};
	
}(window.jQuery);

//-->