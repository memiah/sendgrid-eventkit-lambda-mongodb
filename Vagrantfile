Vagrant.configure("2") do |config|

    config.vm.box = "ubuntu/trusty64"
    config.vm.hostname = "sendgrid-lambda"
    config.ssh.forward_agent = true

    config.vm.provider :virtualbox do |vb|
        vb.memory = 512
    end

    #mount src folder to host
    config.vm.synced_folder "./src", "/opt/server/"

    config.vm.provision "shell", inline: <<-SHELL
        sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 9DA31620334BD75D9DCB49F368818C72E52529D4
        echo "deb [ arch=amd64 ] https://repo.mongodb.org/apt/ubuntu trusty/mongodb-org/4.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-4.0.list
        sudo apt-get update
        sudo apt-get install -y mongodb-org
        curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
        sudo apt-get install -y nodejs 
        sudo npm install -gy lambda-local
    SHELL
    # lambda-local -l index.js -e event.json -E '{\"DATABASE\":\"mongodb://localhost:27017/evie\"}'

end