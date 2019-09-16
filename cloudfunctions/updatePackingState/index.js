// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  try {
    return await db.collection("packingState").doc(event.id).update({
      data:{
        state:event.state
      }
    })
      
  } catch (e) {
    console.error(e)
  }

}