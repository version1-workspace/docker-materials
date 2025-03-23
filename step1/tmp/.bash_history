ls -ltr
exit
exit
ls -ltr
pwd
ls -ltr .ssh
mkdir .ssh
apt-get update && apt-get install -y vim openssh-server
service ssh start
cat << EOF >> ~/.ssh/authorized_keys
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIEw+T3D7RVN/m7kpcIpAyWhVk4xivi6Vk1O1OCH/a8sn admin@jmac.local
EOF

vim /etc/ssh/sshd_config
service ssh restart
ls -ltr
exit
