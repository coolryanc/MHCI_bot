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
	robot.hear(/記帳 (.+)$|記帳本/i,function(res){

		// load js module
		var fsdata = require('fs');
		var path = require('path');

		// get data path
		let filePath = path.join(__dirname, 'data', 'accounting.txt')

		// show ledger
		if(res.message.text==="gakkichan 記帳本" || res.message.text==="記帳本"){
			fsdata.readFile(filePath,'utf8',function(err,data){
				if(err){
					res.reply("Sorry, my bad.."); // can't read data
				}
				else{
					let jsonData = JSON.parse(data);
					let replyStr = "\n";
					jsonData.forEach( function(item, index) {
						let record = (index+1).toString()+". "+item.registerPerson+" say: "+item.say+"  "+item.date+"\n";
						replyStr +=  record;
					});
					res.reply("`記帳本`\n>```"+replyStr+"```");
				}
			});
		}

		// read data & record info
		else{
			var content = res.match[1];
			fsdata.readFile(filePath,'utf8',function(err,data){
				if(err){
					res.reply("Sorry, my bad.."); // can't read data
				}
				else{

					// record info
					let jsonData = JSON.parse(data);
					let pushData = {"registerPerson":"", "say":"", "date":""};
					let today = new Date();
					today = today.getMonth()+1 +'/'+ today.getDate() +'/'+ today.getFullYear();
					pushData.registerPerson = res.message.user.name;
					pushData.say = content;
					pushData.date = today;
					jsonData.push(pushData);

					//write back data
					fsdata.writeFile(filePath, JSON.stringify(jsonData), function(err){
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

	robot.hear(/刪帳 (.+)/i, function(res){
        // load js module
		var fsdata = require('fs');
		var path = require('path');

    let isAllNumber = true;
    let deleteSequence = res.match[1].split(" ");
    deleteSequence.sort();
    res.reply(deleteSequence);
    for (let index = deleteSequence.length-1 ; index>= 0  ; index-- ) {
      if (isNaN(parseInt(deleteSequence[index]))){
        isAllNumber = false;
  			res.reply("刪帳後面接的是 `阿拉伯數字` 喔！`" + deleteSequence[index] + "` 不是!");
        break;
  		}
    }
    if (isAllNumber) {
      // get data path
  		let filePath = path.join(__dirname, 'data', 'accounting.txt')
  		fsdata.readFile(filePath,'utf8',function(err,data){
  			if(err){
  				res.reply("Sorry, my bad.."); // can't read data
  			}
  			else{
  				// record info
  				let jsonData = JSON.parse(data);
  				let delMan = res.message.user.name;
          for (let index = deleteSequence.length-1 ; index>= 0  ; index-- ) {
            var delIndex = parseInt(deleteSequence[index])-1;
    				if (delMan !== jsonData[delIndex].registerPerson){
    					res.reply("不要亂刪別人的帳！！！");
              break;
    				}
    				else {
    					jsonData.splice(delIndex,1);
    				 }
           } // end for
           //write back data
           fsdata.writeFile(filePath, JSON.stringify(jsonData), function(err){
             if(err){
               res.reply("I can't record...");
             }
             else{
               res.reply("好囉！幫你刪掉囉，可以打 `記帳本` 去看帳本");
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
