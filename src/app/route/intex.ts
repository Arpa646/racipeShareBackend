import express from 'express';

import { AuthRoutes } from '../modules/Auth/auth.route';
import { UserRoutes } from '../modules/Registration/user.route';


import { PremiumRoutes } from '../modules/Premium/premium.route';
import { RecipieRoutes } from '../modules/Recipie/recipie.route';



const router=express.Router()



const modulerRoutes=[

    {
        path:'/auth',
        route:UserRoutes,
        
    },
    {
        path:'/auth',
        route:AuthRoutes,
        
    },
   
   
    {
        path:'/premium',
        route:PremiumRoutes,
        
    },
    {
        path:'/recipies',
        route:RecipieRoutes,
        
    },
   
 
]

modulerRoutes.forEach(route=>router.use(route.path,route.route))

export default router