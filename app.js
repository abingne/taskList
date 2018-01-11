var store = {
	save(key,value){
		localStorage.setItem(key,JSON.stringify(value));
	},
	fetch(key){
		return JSON.parse(localStorage.getItem(key)) || [];
	},
}
/*
var list = [
	{
		title:"完成vue.js的学习，能独立开发出项目",
		isChecked:true
	},
	{
		title:"拿到微信的原创",
		isChecked:false
	}
];
*/
var list = store.fetch("class");
var filter = {
	all:function(list){
		return list;
	},
	finished:function(list){
		return list.filter(function(item){
			return item.isChecked;
		})
	},
	unfinished:function(list){
		return list.filter(function(item){
			return !item.isChecked;
		})
	}
}

var vm = new Vue({
	el:".main",
	data:{
		list:list,
		todo:"",
		edtorTodos:"",	//记录正在编辑的数据
		beforTitle:"",	//记录正在编辑的数据的title
		visibility:"all"	//通过这个属性值的变化对数据进行改变
	},
	watch:{
		list:{
			handler:function(){
				store.save("class",this.list);
			},
		}
	},
	computed:{
		noCheckedLength:function(){
			return this.list.filter(function(item){
            	return !item.isChecked
            }).length
		},
		filtedList:function(){
			//找到了过滤函数，就返回过滤后的数据，如果没有返回所有数据
			return filter[this.visibility] ? filter[this.visibility](list) : list;
		}
	},
	methods:{
		addTodo:function(ev){//添加任务
			//向list中添加一项任务
			/*
				{
					title:
				}
			 */
			/* 这是一种实现方式
			if (ev.keyCode===13) {
				this.list.push({
					title:ev.target.value
				});
			}
			*/
			//还有另一种方式，使用事件修饰符
			this.list.push({
					title:this.todo,
					isChecked:false
				});
			this.todo = "";
		},
		deleteTodo:function(todo){
			var index = this.list.indexOf(todo);
			this.list.splice(index,1);
		},
		edtorTodo:function(todo){
			this.beforTitle = todo.title;
			this.edtorTodos = todo;
		},
		edtorTodoed:function(todo){
			this.edtorTodos = "";
		},
		cancelTodo:function(todo){
			todo.title = this.beforTitle;
			this.edtorTodos = "";
		}
	},
	directives:{
		"foucs":{
			update(el,binding){
				if (binding.value) {
					el.foucs();
				}
			}
		}
	}
});

function watchHashChange(){
	var hash = window.location.hash.slice(1);
	vm.visibility = hash;
}
watchHashChange();
window.addEventListener("hashchange",watchHashChange);