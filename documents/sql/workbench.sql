select user.* from user, userdiagram
where user.id = userdiagram.userId
and userdiagram.diagramId in
    (select diagram.id from diagram, userdiagram
        where diagram.id = userdiagram.diagramId
        and userdiagram.usersd = 1)

