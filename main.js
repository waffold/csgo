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
		{name : "Karambit | Gamma Doppler", stattrak : true, t : 'FN'},
		{name : "Butterfly | Fade", stattrak : false, t : 'MW'},
		{name : "Spectrum Case", stattrak: false, t: "u"},
		{name : "Spectrum Case Key", stattrak: false, t: "u"},
		{name : "Stilleto | Forest DDPAT", stattrak : true, t : 'WW'},
		{name : "M4A1-S | Vaporwave", stattrak : true, t : 'BS'},
		{name : "AWP | Atheris", stattrak : false, t : 'FT'},
	]
}

let upgrades = {
	"+cash" : {"max" : 10, "cost" : 76, "costscale" : 1.5},
	"luck" : {"max" : 10, "cost" : 83, "costscale" : 1.6}
}

let gitems = [
	//cases
	{name: 'Gamma Case', price: 0.75,  case: 'gamma', class: 'standard', type: 'case'}, 
	{name: 'Spectrum Case', price: 2.50, case: 'spectrum', class: 'standard', type: 'case'}, 
	{name: 'Spectrum Case 2', price: 1.50, case: 'spectrum2', class: 'standard', type: 'case'},

	//Gamma Case
	{name: "M4A1-S | Vaporwave", price: 144.32, class: "covert", case: "gamma", type: "skin", stattrak: false},
	{name: "Karambit | Gamma Doppler", price: 3456.70, class: "exceedingly_rare", case: "gamma", type: "skin", stattrak: false},
	{name: "Butterfly | Fade", price: 1459.4, class: "exceedingly_rare", case: "gamma", type: "skin", stattrak: false},
	{name: "Stilleto | Forest DDPAT", price: 180.76, class: "exceedingly_rare", case: "gamma", type: "skin", stattrak: false},
	{name: "AWP | Atheris", price: 13.45, class: "restricted", case: "gamma", type: "skin", stattrak: false},

	//Keys
	{name: "Spectrum Case Key", price: 2.40, class: "standard", case: "spectrum", type: "key"}
	
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

	let wears = {
		'FN' : 1.8,
		'MW' : 1.6,
		'FT' : 1.4,
		'WW' : 1.2,
		'BS' : 1,
		'C' : 1,
		'K' : 1
	}
	for(let i = 0; i < user.inv.length; i++) {
		let data = getItemData(user.inv[i].name);
		let price = data.price * wears[user.inv[i].t];
		let np = (i)/pp;

		let div = document.createElement("div");
		div.className = "item";
		div.setAttribute("n", i);
		div.setAttribute('p', Math.floor(np));

		let inner = document.createElement("div");
		inner.className = "item-inner " + data.class + ' ' + user.inv[i].t;
		console.log(data);
		inner.innerHTML = '<img class="inner-image ' + data.type + '" src="https://raw.githubusercontent.com/waffold/csgo/main/images/' + data.name.replace(" | ", '').replace(' ', '').replace(' ', '') + '.png" alt="My Image">';
		if(user.inv[i].stattrak) {
			let st = document.createElement('div');
			st.className = 'stattrak';
			inner.appendChild(st);
		}
		inner.addEventListener('click', function() {
			showPopup('item-info', user.inv[i]);
		})
	
		let itemActions = document.createElement('div');
		itemActions.className = 'itemActions';
	
		let title = document.createElement('div');
		title.className = 'item-title';
		title.innerHTML = data.name;
		inner.appendChild(title);
		
		let sb = document.createElement('button');
		sb.innerHTML = "Sell $" + price.toFixed(2);
		sb.className = "item-b";
		let isCase = data.type == 'case';
		if(data.type == 'skin') {
			sb.classList.add("item-sell")
			let w = document.createElement('span');
			w.className = "inv-item-wear";
			w.innerHTML = user.inv[i].t;
			inner.appendChild(w);
			itemActions.appendChild(sb);
		}
		if(data.type == 'case') {
			sb.classList.add('case-sell');
			let ob = document.createElement('button');
			ob.innerHTML = "Open";
			ob.className = "item-b case-open";
			itemActions.appendChild(ob);
		}
		if(data.type == 'key') {
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
		console.log(gitems[i].type);
		if(gitems[i].type == 'case') {
			let data = getItemData(gitems[i].name);
			let div = document.createElement('div');
			let price = data.price;
			div.className = "item";
			div.setAttribute('n', i);

			let inner = document.createElement('div');
			inner.className = "item-inner " + data.class;
			console.log(data.name);
			console.log(data.name.replace(" | ", '').replace(' ', '').replace(' ', ''));
			inner.innerHTML = '<img class="inner-image case" src="https://raw.githubusercontent.com/waffold/csgo/main/images/' + data.name.replace(" | ", '').replace(' ', '').replace(' ', '') + '.png" alt="skin">';
			inner.addEventListener('click', function() {
				showPopup('case-info', data);
			})

			let title = document.createElement('div');
			title.className = 'item-title';
			title.innerHTML = data.name;

			inner.appendChild(title);

			div.appendChild(inner);

			let itemActions = document.createElement('div');
			itemActions.className = 'itemActions';

			let bb = document.createElement('button');
			bb.className = 'item-b item-sell';
			bb.innerHTML = "Buy: $" + price;
			bb.addEventListener('click', function() {
				let n = bb.parentNode.parentNode.getAttribute("n");
				let a = getItemData(gitems[n]);

				if(user.cash >= a.price) {
					user.inv.push(a);
					user.cash -= a.price;

					rendCash();
				}

			})
			itemActions.appendChild(bb);
			div.appendChild(itemActions);
			items.push(div);
			$('#shop-items').appendChild(div);
		}
	}
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

let popups = document.getElementsByClassName("popup");
function showPopup(t, e) {
	let data = e;
	console.log(data);
	for(let i = 0; i<popups.length; i++) {
		$('#' + popups[i].id).classList.toggle("show", false);
	}
	$("#" + t).classList.toggle("show", true);

	$('#' + t).innerHTML = '';
	let header = document.createElement('div');
	header.className = 'popup-header';

	let backBtn = document.createElement('button');
	backBtn.innerHTML = "<< Back";
	backBtn.className = 'popup-close';
	backBtn.setAttribute('popup', t);
	backBtn.addEventListener('click', function() {
		$('#'+backBtn.getAttribute('popup')).classList.toggle('show', false);
	})
	header.appendChild(backBtn);

	if(t == 'case-info') {
		let items = document.createElement('div');
		items.className = 'info-container';
		let title = document.createElement('div');
		title.className = 'popup-title';
		title.innerHTML = data.name;
		header.appendChild(title);
		let caseContent = gitems.filter(e => e.case == data.case && e.type == 'skin');
		for(let i = 0; i<caseContent.length; i++) {
			let data = getItemData(caseContent[i].name);
			let div = document.createElement('div');
			div.className = "item";

			let inner = document.createElement('div');
			inner.className = "item-inner " + data.class;
			inner.innerHTML = '<img class="inner-image " src="https://raw.githubusercontent.com/waffold/csgo/main/images/' + data.name.replace(" | ", '').replace(' ', '').replace(' ', '') + '.png" alt="skin">';

			let title = document.createElement('div');
			title.className = 'item-title';
			title.innerHTML = data.name;

			inner.appendChild(title);

			div.appendChild(inner);
			items.appendChild(div);
		}
		$('#case-info').appendChild(header);
		$('#case-info').appendChild(items);
	}

	if(t == 'item-info') {
		let info = document.createElement('div');
		let img = document.createElement('img');
		img.className = "info-img";
		img.src = "https://raw.githubusercontent.com/waffold/csgo/main/images/" + data.name.replace(" | ", '').replace(' ', '').replace(' ', '') + ".png";
		img.alt = 'skin';
		info.className = 'info-container item-info';
		info.appendChild(img);

		let title = document.createElement('div');
		title.className = 'popup-title';
		title.innerHTML = e.name;
		header.appendChild(title);

		let raritys = {
			'exceedingly_rare' : 'Exceedingly Rare',
			'covert' : "Covert",
			"restricted" : "Restricted"
		}
		let wears = {
			'FN' : 1.8,
			'MW' : 1.6,
			'FT' : 1.4,
			'WW' : 1.2,
			'BS' : 1,
			'C' : 1,
			'K' : 1
		}

		let infodata = getItemData(e.name);

		let stats = document.createElement('div');
		let rarity = document.createElement('span');
		rarity.className = 'info-stat';
		rarity.innerHTML = 'Rarity: ' + raritys[infodata.class];
		let st = document.createElement('span');
		st.className = 'info-stat';
		st.innerHTML = 'Stattrak: ' + data.stattrak;
		let price = document.createElement('span');
		price.className = 'info-stat';
		let cost = infodata.price * wears[data.t]
		price.innerHTML = 'Price: ' + cost.toFixed(2);

		info.appendChild(rarity);
		info.appendChild(st);
		info.appendChild(price);

		$('#item-info').appendChild(header);
		$('#item-info').appendChild(info);
	}
}

function getItemData(n) {
	return gitems.find(a => a.name == n) || false;
}


