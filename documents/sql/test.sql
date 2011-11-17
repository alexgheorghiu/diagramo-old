use diagramo;

INSERT INTO `user` (`id`, `name`,`email`, `password`, `createdDate`)
    VALUES (1, 'Alex' , 'alex@scriptoid.com', MD5('alex'), '2010-06-02 10:34:23');

INSERT INTO `user` (`id`, `name`, `email`, `password`, `createdDate`)
    VALUES (2, 'Nisa' , 'nisa@scriptoid.com', MD5('nisa'), '2010-12-15 15:04:23');

INSERT INTO `user` (`id`, `name`, `email`, `password`, `createdDate`)
    VALUES (3, 'Becky' , 'becky@scriptoid.com', MD5('becky'), '2010-12-15 15:23:03');
