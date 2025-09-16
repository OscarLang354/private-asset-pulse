# 🚀 Vercel Deployment Guide

Complete step-by-step guide for deploying Private Asset Pulse to Vercel.

## 📋 Prerequisites

- GitHub account with repository access
- Vercel account (free tier available)
- Environment variables prepared

## 🔧 Step-by-Step Deployment

### 1. Connect to Vercel

1. **Visit Vercel Dashboard**
   - Go to [https://vercel.com/dashboard](https://vercel.com/dashboard)
   - Sign in with your GitHub account

2. **Create New Project**
   - Click the "New Project" button
   - Select "Import Git Repository"
   - Choose your repository from the list
   - Click "Import"

### 2. Configure Project Settings

1. **Project Configuration**
   - **Project Name**: `private-asset-pulse` (or your preferred name)
   - **Framework Preset**: Vite
   - **Root Directory**: `./` (default)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

2. **Environment Variables**
   Add the following environment variables in the Vercel dashboard:

   ```
   NEXT_PUBLIC_CHAIN_ID=11155111
   NEXT_PUBLIC_RPC_URL=YOUR_RPC_URL
   NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=YOUR_PROJECT_ID
   NEXT_PUBLIC_INFURA_API_KEY=YOUR_INFURA_KEY
   ```

   **How to add environment variables:**
   - In the project settings, go to "Environment Variables"
   - Click "Add New"
   - Enter the variable name and value
   - Select "Production", "Preview", and "Development" environments
   - Click "Save"

### 3. Deploy the Application

1. **Initial Deployment**
   - Click "Deploy" button
   - Wait for the build process to complete (usually 2-3 minutes)
   - Monitor the build logs for any errors

2. **Verify Deployment**
   - Once deployed, you'll receive a URL like `https://your-project.vercel.app`
   - Click the URL to visit your deployed application
   - Test wallet connection and basic functionality

### 4. Custom Domain Setup (Optional)

1. **Add Custom Domain**
   - Go to project settings
   - Navigate to "Domains" section
   - Click "Add Domain"
   - Enter your domain name

2. **Configure DNS**
   - Add the following DNS records to your domain provider:
     ```
     Type: CNAME
     Name: www
     Value: cname.vercel-dns.com
     
     Type: A
     Name: @
     Value: 76.76.19.61
     ```

3. **SSL Certificate**
   - Vercel automatically provisions SSL certificates
   - Wait for certificate validation (usually 24-48 hours)

### 5. Production Optimizations

1. **Performance Settings**
   - Enable "Automatic HTTPS" in project settings
   - Configure "Edge Functions" if needed
   - Set up "Analytics" for monitoring

2. **Security Headers**
   Add the following to `vercel.json`:
   ```json
   {
     "headers": [
       {
         "source": "/(.*)",
         "headers": [
           {
             "key": "X-Frame-Options",
             "value": "DENY"
           },
           {
             "key": "X-Content-Type-Options",
             "value": "nosniff"
           },
           {
             "key": "Referrer-Policy",
             "value": "origin-when-cross-origin"
           }
         ]
       }
     ]
   }
   ```

### 6. Monitoring and Maintenance

1. **Analytics Setup**
   - Enable Vercel Analytics in project settings
   - Monitor performance metrics and user behavior

2. **Error Tracking**
   - Set up error monitoring (Sentry, LogRocket, etc.)
   - Configure alerts for critical errors

3. **Backup Strategy**
   - Regular database backups (if applicable)
   - Code repository backups via GitHub

## 🔍 Troubleshooting

### Common Issues

1. **Build Failures**
   - Check build logs in Vercel dashboard
   - Verify all dependencies are in `package.json`
   - Ensure environment variables are set correctly

2. **Environment Variables Not Working**
   - Verify variable names match exactly (case-sensitive)
   - Check that variables are added to all environments
   - Redeploy after adding new variables

3. **Wallet Connection Issues**
   - Verify WalletConnect Project ID is correct
   - Check RPC URL is accessible
   - Ensure chain ID matches your configuration

4. **Performance Issues**
   - Enable Vercel's Edge Network
   - Optimize images and assets
   - Use Vercel's Image Optimization

### Debug Commands

```bash
# Test build locally
npm run build

# Preview production build
npm run preview

# Check for linting errors
npm run lint

# Verify environment variables
echo $NEXT_PUBLIC_CHAIN_ID
```

## ✅ Post-Deployment Checklist

- [ ] Application loads without errors
- [ ] Wallet connection works properly
- [ ] All pages are accessible
- [ ] Environment variables are loaded
- [ ] SSL certificate is active
- [ ] Analytics are tracking
- [ ] Error monitoring is set up
- [ ] Performance is acceptable
- [ ] Mobile responsiveness works
- [ ] SEO meta tags are correct

## 💰 Cost Considerations

### Vercel Pricing
- **Hobby Plan**: Free (suitable for development and small projects)
- **Pro Plan**: $20/month (recommended for production)
- **Enterprise**: Custom pricing

### Additional Costs
- **Domain**: $10-15/year (if using custom domain)
- **Infura**: Free tier available, paid plans for higher usage
- **WalletConnect**: Free tier available

## 🆘 Support

If you encounter issues during deployment:

1. **Check Vercel Documentation**: [https://vercel.com/docs](https://vercel.com/docs)
2. **Vercel Community**: [https://github.com/vercel/vercel/discussions](https://github.com/vercel/vercel/discussions)
3. **Project Issues**: [GitHub Issues](https://github.com/OscarLang354/private-asset-pulse/issues)

---

**🎉 Deployment completed successfully!**

Your Private Asset Pulse platform is now live and ready for users to trade tokenized real-world assets with FHE encryption.