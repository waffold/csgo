function $(a) {
	return document.querySelector(a);
}

document.addEventListener("DOMContentLoaded", function() {
	rendUpgrades();
	rendCash();

	$('#clicker').addEventListener('mousedown', function(e) {
		e.preventDefault();
		$('#clicker-text').style.transform = 'scale(1.2)';
		earn(e);
	});
	$('#clicker').addEventListener('mouseup', function(e) {
		e.preventDefault();
		$('#clicker-text').style.transform = 'scale(1)';
	});

	$('#inv-prev').addEventListener('click', function() {
		let page = $('#inv-page-n').innerHTML;
		if(page > 1) {
			$('#inv-page-n').innerHTML = Number(page) -1;
			rendInv();
		}
	})
	
	$('#inv-next').addEventListener('click', function() {
		let page = $('#inv-page-n').innerHTML
		let items = document.getElementsByClassName('item');
		let cap = Math.ceil(user.inv.length/getItemsPerPage());
		if(page < cap) {
			$('#inv-page-n').innerHTML = Number(page) + 1;
			rendInv();
		}
	})
});

// Clicks per second

let user = {
	"cash": 0,
	"cpc" : 1,
	"upgrades" : {
		"+cash" : 1,
		"luck" : 1
	},
	"inv" : [
		{name : "Karambit | Gamma Doppler", cost : 3458.58, class : "exceedingly_rare", type: "skin", stattrak : true, wear : 'FN'},
		{name : "Butterfly | Fade", cost : 1457.53, class : "exceedingly_rare", type: "skin", stattrak : false, wear : 'MW'},
		{name : "Spectrum Case", cost : 0.50, case: 'spectrum', class : "standard", type: "case"},
		{name : "Spectrum Case Key", cost : 2.40, case: 'spectrum', class : "standard", type: "key"},
		{name : "Stilleto | Forest DDPAT", cost : 245.3, class : "exceedingly_rare", type: "skin", stattrak : true, wear : 'WW'},
		{name : "M4A1-S | Vaporwave", cost : 144.32, class : "covert", type: "skin", stattrak : true, wear : 'BS'},
		{name : "AWP | Atheris", cost : 13.45, class : "restricted", type: "skin", stattrak : false, wear : 'FT'},
	]
}

let upgrades = {
	"+cash" : {"max" : 10, "cost" : 76, "costscale" : 1.5},
	"luck" : {"max" : 10, "cost" : 83, "costscale" : 1.6}
}

let gitems = [
	{name: 'Gamma Case', cost: 0.75,  case: 'gamma', class: 'standard', type: 'case'},
	{name: 'Spectrum Case', cost: 2.50, case: 'spectrum', class: 'standard', type: 'case'},
	{name: 'Spectrum Case 2', cost: 1.50, case: 'spectrum2', class: 'standard', type: 'case'}
]

function rendUpgrades() {
	let ub = document.getElementsByClassName("upgrade-button");
	for(let i=0; i<ub.length; i++) {
		let bid= ub[i].id;
		ub[i].innerHTML = "Buy: $" + upgrades[bid].cost;
		if(user.upgrades[bid] == upgrades[bid].max) {ub[i].innerHTML = "MAX";}
	}

	let ul = document.getElementsByClassName("upgrade-amount");
	for(let i=0; i<ul.length; i++) {
		ul[i].innerHTML = "Level: " + user.upgrades[ul[i].id];
	}
}

function rendCash()	 {
	user.cash = Number(user.cash.toFixed(2));
	$('#cash_text').innerHTML = "Cash: " + user.cash.toString();

	
	$('#cpc-text').innerHTML = "Cash/Click: $" + user.upgrades["+cash"];

	let total = 0;
	for(let i = 0; i < user.inv.length; i++) {
		total += user.inv[i].cost;
	}
	$('#value_text').innerHTML = "Value: $" + total.toFixed(2);
}

function rendInv() {
	let ei = document.getElementsByClassName('inv-item');
	$("#inv-items").innerHTML = "";
	let pp = getItemsPerPage();
	let items = [];
	let page = $('#inv-page-n').innerHTML;
	for(let i = 0; i < user.inv.length; i++) {
		let e = user.inv[i];
		let div = document.createElement("div");
		div.className = "item";
		div.setAttribute("n", i);
		let np = (i)/pp;
		div.setAttribute('p', Math.floor(np));
		let inner = document.createElement("div");
		inner.className = "item-inner " + e.class + ' ' + e.wear;
		//inner.innerHTML = '<img class="inner-image" src="https://drive.google.com/thumbnail?id=1_NC2U20fjVv-_h5Dfa61v4BcQe2iugZG&sz=w1000" alt="My Image">';
		inner.innerHTML = '<img class="inner-image" src="https://drive.google.com/uc?export=view&id=1_NC2U20fjVv-_h5Dfa61v4BcQe2iugZG" alt="My Image">';
	
		let itemActions = document.createElement('div');
		itemActions.className = 'itemActions';
	
		let title = document.createElement('div');
		title.className = 'item-title';
		title.innerHTML = e.name;
		inner.appendChild(title);
		
		let sb = document.createElement('button');
		sb.innerHTML = "Sell $" + e.cost.toFixed(2);
		sb.className = "item-b";
		let isCase = e.type == 'case';
		if(e.type == 'skin') {
			sb.classList.add("item-sell")
			let w = document.createElement('span');
			w.className = "inv-item-wear";
			w.innerHTML = e.wear;
			inner.appendChild(w);
			itemActions.appendChild(sb);
		}
		if(e.type == 'case') {
			sb.classList.add('case-sell');
			let ob = document.createElement('button');
			ob.innerHTML = "Open";
			ob.className = "item-b case-open";
			itemActions.appendChild(ob);
		}
		if(e.type == 'key') {
			sb.classList.add("item-sell");
		}
		
		div.appendChild(inner);
		div.appendChild(itemActions);
		itemActions.insertBefore(sb, itemActions.firstChild);
		sb.addEventListener('click', function() {
			let a = sb.parentNode.parentNode.getAttribute("n");
			let price = user.inv[a].cost;

			user.cash += price;
			user.inv.splice(a, 1);

			sb.parentNode.parentNode.parentNode.removeChild(sb.parentNode.parentNode);

			rendCash();
			getLastPage();
			rendInv();
		})
		items.push(div);
		
	}
	let vi = items.filter(el => el.getAttribute("p") == Number(page)-1);
	for(let i = 0; i < vi.length; i++) {
		$('#inv-items').appendChild(vi[i]);
	}
}

function rendShop() {
	$('#shop-items').innerHTML = '';
	let items = [];
	for(let i = 0; i < gitems.length; i ++) {
		if(gitems[i].type == 'case') {
			let e = gitems[i];
			let div = document.createElement('div');
			div.className = "item";
			div.setAttribute('n', i);

			let inner = document.createElement('div');
			inner.className = "item-inner " + e.class + ' ' + e.wear;
			inner.innerHTML = '<img class="inner-image" src="https://drive.google.com/thumbnail?id=1_NC2U20fjVv-_h5Dfa61v4BcQe2iugZG&sz=w1000" alt="My Image">';

			let title = document.createElement('div');
			title.className = 'item-title';
			title.innerHTML = e.name;

			inner.appendChild(title);
			console.log(inner);

			div.appendChild(inner);

			let itemActions = document.createElement('div');
			itemActions.className = 'itemActions';

			let bb = document.createElement('button');
			bb.className = 'item-b item-sell';
			bb.innerHTML = "Buy: $" + gitems[i].cost;
			bb.addEventListener('click', function() {
				let n = bb.parentNode.parentNode.getAttribute("n");
				let a = gitems[n];

				if(user.cash >= a.cost) {
					user.inv.push(a);
					console.log(user.cash, a.cost);
					user.cash -= a.cost;
					console.log(user.cash);

					rendCash();
				}

			})
			itemActions.appendChild(bb);
			div.appendChild(itemActions);
			items.push(div);
			$('#shop-items').appendChild(div);
		}
	}
	console.log(items);
}


function earn(e) {
	if($('#earn-page').className == "page show") {
		let r = Number((Math.random()*user.upgrades['+cash']).toFixed(2));
		user.cash += r;
		
		rendCash();
		
		let div = document.createElement('div');
		div.innerHTML = "+ $" + r;
		div.className = 'fadeup';

		setTimeout(function() {
			div.parentNode.removeChild(div);
		}, 1000);
		$('#overlay').appendChild(div);
		div.style.left = e.pageX - (Math.random().toFixed(2)*20 + 20) + 'px';
		div.style.top = e.pageY + 'px';
	}
}

let pages = document.getElementsByClassName("page");
let nb = document.getElementsByClassName("nav-button");
function showPage(a) {
	for(let i = 0; i<pages.length; i++)
	{
        pages[i].classList.toggle("show", false);
		if (a != false) {
			$('#' + a + "-page").classList.toggle('show', true);
		}
	}
	if(a == 'inv') {
		rendInv();
	}
	if(a == 'shop') {
		rendShop();
	}
	for(let i = 0; i<nb.length; i++) {
		nb[i].classList.toggle("on", false);
		if (nb[i].id == "nav-" + a) {
			nb[i].classList.toggle("on", true);
		}
 	}
}

function upgrade(a) {
	let u = upgrades[a];
	if(u.cost <= user.cash && u.max > user.upgrades[a]) {
		user.cash -= u.cost;
		u.cost *= u.costscale;
		u.cost = Number(u.cost.toFixed(2));
		user.upgrades[a] ++;
		rendUpgrades();
		rendCash();
	}
}

window.addEventListener('resize', () => {
	if($('#inv-page').className == 'page show') {
		getLastPage();
    	rendInv();
	}
});

function getLastPage() {
	let fit = getItemsPerPage();
	let page = Number($('#inv-page-n').innerHTML);
	let lastPage = Math.ceil(user.inv.length / fit)
	if(lastPage == 0) {lastPage = 1}
	if(page > lastPage) {$('#inv-page-n').innerHTML = lastPage}
}

function getItemsPerPage() {
	let margin = 300;
	if(window.innerWidth < 480) {margin = 50}
	let x = Math.floor((window.innerWidth - margin)/170);
	let y = Math.floor((window.innerHeight - 100)/230);
	if(x*y == 0) {return 1}
	if(y>3) {y = 3}
	return x*y;
}

function getItemData(n) {
	for(let i = 0; i < gitems.length; i ++) {
		if(gitems[i].name = n) {
			return gitems[i];
		}
	}
}

function createItem(e, i) {
	

	return div;
}


