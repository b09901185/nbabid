const Mutation = {
    createUser: async(parent, { input }, { db, pubsub }) => {
        const newUser = new db.userModel(input)
        await newUser.save()
        pubsub.publish("USER_CREATED",{
            userCreated: newUser,
        })
        return newUser
    },
    updateCash: async(parent, { input }, { db, pubsub }) => {
        let {user, money} = input
        const username = db.userModel.findOne(user)
        const id = username.id
        const find = await db.userModel.findOneAndUpdate(
            {id},
            {
                $set: {
                    cash: username.cash+money
                }
            },
            {returnDocument: 'after'}
        )
        pubsub.publish("CASH_UPDATED"),{
            cashUpdated: id,
        }
        return find
    },
    createBid: async(parent, { input }, { db, pubsub }) => {
        const newBid = new db.bids(input)
        await newBid.save()
        pubsub.publish("BID_CREATED",{
            bidCreated: newBid,
        })
        return newBid
    }
}

export {Mutation as default}