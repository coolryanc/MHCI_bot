module.exports = function(robot){

	// ============
	// Introduction
	// ============
    robot.respond(/hello|hi/gi, function(res){
        res.reply('My name is `gakki`! Nice to help u!');
    });


    // ============
	// ledger info
	// ============
	robot.hear(/記帳 (.*)|記帳本/i,function(res){

		// load js module
		var fsdata = require('fs');
		var path = require('path');

		// get data path 
		let filepath = path.join(__dirname, 'data', 'accounting.txt')

		// show ledger 
		if(res.message.text==="maimai 記帳本" || res.message.text==="記帳本"){
			fsdata.readFile(filepath,'utf8',function(err,data){
				if(err){
					res.reply("Sorry, my bad.."); // can't read data
				}
				else{
					
					let jsonData = JSON.parse(data);
					let replyStr = "";
					jsonData.forEach( function(item, index) {
						let record = (index+1).toString()+". "+item.registerPerson+" say: "+item.say+"\n";
						replyStr +=  record;
					});
					res.reply("`記帳本`\n>```"+replyStr+"```");
				}
			});
		}

		// read data & record info
		else{
			var content = res.match[1];
			fsdata.readFile(filepath,'utf8',function(err,data){
				if(err){
					res.reply("Sorry, my bad.."); // can't read data
				}
				else{

					// record info
					let jsonData = JSON.parse(data);
					let pushData = {"registerPerson":"", "say":""};
					pushData.registerPerson = res.message.user.name;
					pushData.say = content;
					jsonData.push(pushData);

					//write back data
					fsdata.writeFile(filepath, JSON.stringify(jsonData), function(err){
						if(err){
							res.reply("I can't record...");
						}
						else{
							res.reply("好囉！幫你記好了，可以打 `記帳本` 去看帳本");
						}
					});// End write file
				} 
			});// End read file
		}
	});


	// ============
	// Listeners
	// ============
	// robot.listen(function(message) {
	//   return message.user.name === "wuder";
	// }, function(res) {
	//   return res.reply('無德你好吵');
	// });
   
}






