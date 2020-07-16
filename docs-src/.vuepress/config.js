module.exports = {
    title: 'Anthos on HPE SimpliVity',
    dest: '../Anthos-Docs/',
    //base: '/Anthos-on-SimpliVity/Anthos-Docs-Draft/',  
    base: '/Anthos-on-SimpliVity/',    
      //plugins: ['vuepress-plugin-export'], 
    plugins: {
      '@vssue/vuepress-plugin-vssue': {
        // set `platform` rather than `api`
        platform: 'github',
  
        // all other options of Vssue are allowed
        owner: 'gabrielmcg',
        repo: 'Anthos-on-SimpliVity',
        clientId: process.env.VUE_APP_VSSUE_CLIENTID,
        clientSecret: process.env.VUE_APP_VSSUE_CLIENTSECRET,
  
        autoCreateIssue: false,
        prefix: '[Docs]',
        //labels: ['FirstDraft'],
        admins: ['gabrielmcg', 'moyni77'],
      },
    }, 
    themeConfig: {
      nav: [
        { text: 'Home', link: '/' },
        { text: 'Blog', link: '/blog/' }
      ],
  
      algolia: {
        apiKey: process.env.VUE_APP_ANTHOS_ALGOLIA_APIKEY,
        indexName: process.env.VUE_APP_ANTHOS_ALGOLIA_INDEXNAME
      },
      
      logo: '/assets/images/hpe-logo-nav.jpg',
  
      repo: 'HewlettPackard/Anthos-on-SimpliVity',
      // Customising the header label
      // Defaults to "GitHub"/"GitLab"/"Bitbucket" depending on `themeConfig.repo`
      repoLabel: 'Contribute!',
  
      // Optional options for generating "Edit this page" link
  
      // if your docs are in a different repo from your main project:
  
      //docsRepo: 'https://github.com/gabrielmcg/Anthos-on-SimpliVity',
      docsRepo: 'https://github.com/HewlettPackard/Anthos-on-SimpliVity',
      // if your docs are not at the root of the repo:
      docsDir: 'docs-src',
      // if your docs are in a specific branch (defaults to 'master'):
      docsBranch: 'docs-dev',
  
      // defaults to false, set to true to enable
      editLinks: true,
      // custom text for edit link. Defaults to "Edit this page"
      editLinkText: 'Help us improve this page!',
  
  
      sidebar: [
        '/summary',
        {
          title: 'Release Notes',
          collapsable: true,
          children: [
            '/rel-notes/rel-notes',
            //'/rel-notes/new-features',
            //'/rel-notes/fixed-issues',
            '/rel-notes/known-issues'
          ]
        },

        {
          title: 'Solution overview',
          children: [
            'soln-overview/soln-overview',
            'soln-overview/containers-k8s-devops',
            'soln-overview/anthos-overview',
            'soln-overview/simplivity-overview',
            ///'soln-overview/simplivity-csi-overview',
            'soln-overview/f5-overview',
            'soln-overview/solution-configuration'
          ]
        },
        {
            title: 'Solution components',
            children: [
              'soln-components/hardware',
              'soln-components/software'//,
              //'soln-components/application-software'
          ]
        },      
        {
            title: 'Preparing the environment ',
            children: [
              'preparing/general-prereqs',
              'preparing/simplivity-prereqs',
              'preparing/f5-prereqs',
              'preparing/anthos-prereqs',
              'preparing/ansible-controller'
            ]
        },      
        {
          title: 'Configuring the solution',
          children: [
            'config-core/intro-config',
            'config-core/general-config',
            'config-core/proxy-config',
            'config-core/input-files',            
            'config-core/vmware-config',
            'config-core/f5-config',            
            'config-core/admin-workstation-config',
            'config-core/admin-user-clusters-config',
            'config-core/simplivity-config',
            //'config-core/csi-config',
            'config-core/csi-vsphere-config',
            'config-core/service-mesh-config',
            'config-core/output-files',
            'config-core/edit-vault',
            'config-core/docker-config',            
            'config-core/sample-variables',
            'config-core/sample-vault'
          ]
        },
        {
          title: 'Running the playbooks',
          children: [ 
            'playbooks/playbooks-intro',
            'playbooks/enables-config', 
            'playbooks/playbooks-preflight',           
            'playbooks/playbooks-gcp-key-create',
            'playbooks/playbooks-prereqs',
            'playbooks/playbooks-f5',
            'playbooks/playbooks-admin-workstation',
            'playbooks/playbooks-create-cluster',
            //'playbooks/playbooks-csi',
            'playbooks/playbooks-csi-vsphere',
            'playbooks/playbooks-service-mesh'
          ]
        },
        {
          title: 'Post deployment tasks',
          children: [ 
            'post-deploy/connect',
            'post-deploy/using-ssh',
            'post-deploy/cloud-console',
            'post-deploy/deploy-application',
            'post-deploy/ingress',
            'post-deploy/resize-cluster'
          ]
        },
        {
          title: 'Storage',
          children: [ 
            'storage/storage-class',
            'storage/use-csi-wordpress'
          ]
        },      
        {
          title: 'Service Mesh',
          children: [ 
            'service-mesh/book-info',
            'service-mesh/kiali',
            'service-mesh/traffic-splitting'
          ]
        }        
      ]
    }
}    