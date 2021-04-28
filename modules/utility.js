module.exports = {
    getRoomMembers: (roomName) => {
        return [
            {
                id: "room-creator",
                username: "admin",
                role: "creator",
            },
            {
                id: "room-guest-1",
                username: "john",
                role: "guest",
            },
            {
                id: "room-guest-2",
                username: "very_long_user_name_xxxXXXxx",
                role: "guest",
            },
            {
                id: "room-guest-3",
                username: "me",
                role: "guest",
            },
            {
                id: "room-guest-4",
                username: "alex",
                role: "guest",
            }
        ]
    },
    getRoomMessages: (roomName) => {
        return [
            {
                username: "admin",
                body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed cursus, metus in aliquam lobortis, mauris massa tempor nisi, ornare molestie dui sapien nec libero. Suspendisse tortor metus, pretium eget fringilla vitae, auctor a magna. Mauris eu tincidunt diam, sit amet scelerisque est. Praesent non dictum tortor. In hac habitasse platea dictumst. Duis et leo purus. Maecenas a ante hendrerit, elementum felis tincidunt, mattis lacus. Nullam auctor vulputate odio, sed eleifend tortor eleifend ut. Donec et felis posuere, tincidunt lectus sagittis, luctus odio. Ut at venenatis enim, at congue erat. Duis mattis nec erat eu suscipit. Maecenas suscipit elementum efficitur. Vestibulum feugiat risus vel tortor tincidunt, sed lacinia orci porta. Aenean at orci sed dui blandit mollis quis eu sem. Nullam hendrerit elit elit, eu aliquam felis tristique id. Vestibulum eu fringilla mauris. In molestie dui ut metus ornare egestas. Nunc malesuada id massa at mollis. Sed eu nulla vitae nulla maximus consectetur et id odio. Vivamus aliquam felis vulputate consectetur auctor. Donec at est ligula. Nam vulputate malesuada enim nec venenatis. Vestibulum interdum dolor eget dui porttitor, id consectetur augue gravida. Ut elementum leo ac mi sodales, sed tristique tellus finibus. Aenean aliquam sollicitudin consectetur. Aliquam et turpis maximus, eleifend erat eu, vulputate purus. Pellentesque mattis neque eu sodales condimentum. Morbi interdum sapien eu ante varius, nec malesuada dui bibendum. Suspendisse facilisis turpis consequat, facilisis mauris ut, finibus leo. Proin eu tellus non ex iaculis vestibulum. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Nunc iaculis porttitor varius. Aliquam erat volutpat. Nunc dignissim pretium mauris. Curabitur id felis et mi bibendum dapibus. Etiam non vehicula lorem. Nulla convallis varius tellus pharetra pellentesque. Sed leo elit, placerat a hendrerit quis, molestie luctus purus. Curabitur ac scelerisque felis. Nunc lorem metus, tristique varius tortor nec, viverra mollis odio. Curabitur est nisl, efficitur a turpis quis, mattis facilisis odio. Mauris finibus, eros sit amet sodales sodales, felis ex volutpat nunc, non bibendum felis mi eget enim. Aenean ut eros a massa condimentum gravida. In volutpat rhoncus tellus vitae tincidunt. Pellentesque sed turpis id eros tincidunt pharetra ac in quam. Mauris varius, tellus ut dignissim elementum, ante turpis faucibus mi, sed suscipit erat ipsum vel libero. Aenean sed dui mattis, dapibus orci sed, bibendum metus. Sed egestas tellus quis magna pellentesque, in rhoncus felis tincidunt. Aliquam accumsan quis felis ut volutpat. Vestibulum dignissim varius diam, quis tincidunt ipsum. Morbi a consectetur libero. Phasellus ut dolor posuere, cursus dolor ac, vehicula nisl. Cras tristique orci sagittis facilisis commodo."
            },
            {
                username: "john",
                body: "hello guyes",
            },
            {
                username: "john",
                body: "guys*",
            }
        ]
    },
    getAllRooms: () => {
        return [
            {
                name: "Test room",
                creator: "admin",
                maxMembers: 10,
                currentMembers: 8,
            },
            {
                name: "Test 2",
                creator: "gues1",
                maxMembers: 6,
                currentMembers: 0,
            },
            {
                name: "alsldalsdlasldalsdla",
                creator: "julian",
                maxMembers: 1,
                currentMembers: 1,
            },
            {
                name: "some other room",
                creator: "admin",
                maxMembers: 1,
                currentMembers: 0,
            }
        ]
    },
    getUserRooms: (username) => {
        return [
            {
                name: "Test1",
                creationDate: "20 Mar 2021",
                maxMembers: 6,
                currentMembers: 0,
            },
            {
                name: "test 2",
                creationDate: "22 Mar 2021",
                maxMembers: 6,
                currentMembers: 0,
            },
            {
                name: "room asd as da sd as da sd",
                creationDate: "28 Apr 2021",
                maxMembers: 6,
                currentMembers: 1,
            },
        ]
    }
};