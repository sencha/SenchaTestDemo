/**
 * @file CheckoutForm.js
 * @name UI/Forms/Checkout Form
 * @created 2017/08/02
 * Tested on Chrome, Firefox, Edge, iOS tablet, Android phone, IE11
 */

describe("CheckoutForm", function() {

	var prefix = '#kitchensink-view-forms-checkout',
		containers = ['Contact Information', 'Shipping Address', 'Billing Address', 'Payment Information'],
		fieldNames = ['firstName', 'lastName', 'email', 'phone', 'shipping_address','shipping_city', 'shipping_state', 
						'shipping_postalcode', 'billing_address','billing_city', 'billing_state', 'billing_postalcode',
						 'payment_name', 'payment_number', 'payment_month', 'payment_year'];

	var actualCard;

	var Form = {
		field: function(id, title) {
            return ST.textField('[name='+fieldNames[id]+']');
        },
        fieldInput: function(num) {
            return ST.element('textfield[name='+fieldNames[num]+'] => input');  
        },
		button: function(text) {
            return ST.component('button[_text='+text+']');
        },
        card: function(title) {
            return ST.component('container[title='+title+']');
        },
        swipeCard: function(trigger) {
        	Form.button(trigger).click();
        },
        goToCard: function(number) {
        	var card;
        	ST.component('form-checkout container[title][_hidden=false]')
        		.and(function(c) {
        			card = c.title;
        			actualCard = containers.indexOf(card) +1;
        			if(actualCard > number) {
		        		for (var i = 0; i < actualCard - number; i++) {
					   		Form.swipeCard('Back');
					    }
					    ST.wait(function(){
		        			return Ext.ComponentQuery.query('form-checkout container[title]:visible')[1].title != card;
		        		});
		        	} else if (actualCard < number){
		        		for (var i = 0; i < number - actualCard; i++) {
					   		Form.swipeCard('Next');
					    }
					    ST.wait(function(){
		        			return Ext.ComponentQuery.query('form-checkout container[title]:visible')[1].title != card;
		        		});
		        	}
        		});
        	
        },
        clear: function(id, set) {
            set = false || set;
            if(set) {
                ST.wait(500);
	            Form.field(id)
	                .and(function(field) {
	                    field.reset();
	                });
            } else {
                Form.field(id)
                    .down('=> div.x-cleartrigger')
                    .click();    
            }
        },
        statePicker: function(id) {
            return ST.comboBox('[name='+fieldNames[id]+']');
        },
        editField: function(id, text, numberOnly) {
        	Form.field(id)
	            .focus()
	            .focused()
	            .type(text)
	            .and(function() {
	            	if(numberOnly){
	            		expect(this.future.cmp.getValue()).toBe(parseInt(text));
	            	} else {
	                	expect(this.future.cmp.getValue()).toBe(text);
	            	}
	            });
        },
        checkShip: function() {
        	ST.component('checkboxfield[reference=sameAsShipping]')
        		.down('=> input')
        		.click();
        },
        resetForm: function(idStart, idEnd) {
        	for (var i = idStart; i < idEnd; i++) {
        		if(i==15) {
        			Form.field(i)
    					.type('12');	
        		} else {
        			Form.field(i)
    					.type('asdf');	
        		}
    			
    		}
    		Form.button('Reset')
    			.click();
    		for(var i=idStart; i<idEnd; i++) {
                Form.fieldInput(i)
                    .and(function(field) {
                        expect(field.dom.value).toBe('');        
                    });
            }
        }

	};

    beforeAll(function() {
        Lib.beforeAll("#form-checkout", prefix);
        ST.component(prefix).visible();
    });
    
    afterAll(function(){
            ST.component('tooltip')
                .and(function() {
                    this.future.cmp.hide();
                });
        Lib.afterAll(prefix);
    });
    
    it('Example should load correctly', function() {
        Lib.screenshot('checkoutFormUI', 10);
    });

    describe('ComboBox selection', function() {

    	describe('State comboBox', function() {

    		it('Shipping state', function() {
    			Form.goToCard(2);
    			Lib.Forms.testCombobox('textfield[name='+fieldNames[6]+']', 'state', 'Alabama', 'AL');
    		});

    		it('Billing state', function() {
    			Form.goToCard(3);
    			Form.checkShip();
    			Lib.Forms.testCombobox('textfield[name='+fieldNames[10]+']', 'state', 'Alabama', 'AL');
    		});
    	});

    	it('Month comboBox', function() {
    		Form.goToCard(4);
    		Lib.Forms.testCombobox('textfield[name='+fieldNames[14]+']', 'name', 'April', 4);
    	});
           
    });

    describe('Segmented button selection', function() {

    	beforeAll(function() {
    		Form.goToCard(4);
    	});

    	it("Toggle card button", function() {   		
    		ST.component(prefix + ' segmentedbutton')
    			.visible();

    		var cards = ['Visa', 'MasterCard', 'AMEX', 'Discover']	
    		for(var i=0; i<4; i++) {
    			Form.button(cards[i])
    				.click()
    				.and(function(btn){
    					expect(btn._pressed).toBe(true);
    				})
    		}
    	});
           
    });

    describe('Reset', function() {

    	it('Shipping Address', function() {
    		Form.goToCard(2);
    		Form.resetForm(4, 8);
    	});

    	it('Billing Address', function() {
    		Form.goToCard(3);
    		Form.checkShip();
    		Form.resetForm(8, 12);
    	});

    	it('Payment Information', function() {
    		Form.goToCard(4);
    		Form.resetForm(12, 16);
    	});
           
    });

    describe('Confirm form', function() {

    	it('Submit invalid', function() {
    		Form.goToCard(4);
    		Form.button('Submit')
    			.click();
    		ST.component('messagebox[_title=Invalid]')
                .visible()
                .down('button')
                .click()
                .hidden(); 
    	});
           
    });

    it("should open source window when clicked", function() {
        Lib.sourceClick("form-checkout");
    });
});